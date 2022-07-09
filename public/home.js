const askedQues = document.getElementById("askedQues");
const newTab = document.getElementById("newTab");
const hotTab = document.getElementById("hotTab");
const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");
const profileBtn = document.getElementById("profile-btn");
let newQues = [];
let hotQues = [];
let pages = [1,1];

let useremail;
async function checkLogin(){
    await fetch("https://stormy-lake-92165.herokuapp.com/check_login",{
        method: "GET",
        credentials: "same-origin"
    }).then((res) => res.json()).then((jsonResponse) => {
        if(jsonResponse["result"] === "token expired" || jsonResponse["result"] === "no token passed"){
            window.location.href = "/auth_page";
            return false;
        }
        useremail = jsonResponse["result"];
        profileBtn.setAttribute("href","user/get/" + useremail);
        return true;
    });
}

newTab.addEventListener('click',(e) => {
    if(newTab.classList.length==5) return;
    hotTab.classList.remove("active");
    newTab.classList.add("active");
    askedQues.innerHTML=null;
    newQues.forEach(element => askedQues.appendChild(element));
});

hotTab.addEventListener('click',(e) => {
    if(hotTab.classList.length==5) return;
    newTab.classList.remove("active");
    hotTab.classList.add("active");
    askedQues.innerHTML=null;
    hotQues.forEach(element => askedQues.appendChild(element));
});


function getQuestionTile(title, description, redirectLink,viewsString){
    let tile = document.createElement("div");
    tile.classList.add("card");
    tile.classList.add("w-80");
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    let titleElement = document.createElement("h5");
    titleElement.classList.add("card-title");
    titleElement.innerHTML = title;
    let viewsElement = document.createElement("p");
    viewsElement.classList.add("card-text");
    viewsElement.innerText=viewsString;
    let topArea = document.createElement("div");
    topArea.id = "top-area";
    topArea.appendChild(titleElement);
    topArea.appendChild(viewsElement);
    let descp = document.createElement("p");
    descp.classList.add("card-text");
    descp.innerHTML = description;
    let btnDiv = document.createElement("div");
    btnDiv.classList.add("float-start");
    let btn = document.createElement("a");
    btn.classList.add("btn");
    btn.classList.add("btn-primary");
    btn.setAttribute("href",redirectLink);
    btn.innerHTML = "View Answers";
    btnDiv.appendChild(btn);
    cardBody.appendChild(topArea);
    // cardBody.appendChild(titleElement);
    cardBody.appendChild(descp);
    cardBody.appendChild(btnDiv);
    tile.appendChild(cardBody);
    return tile;
}

async function getQuestions(sub_endpoint){
    let result;
    await fetch("https://stormy-lake-92165.herokuapp.com/question" + sub_endpoint + "?page=" + pages[sub_endpoint=="/all" ? 0 : 1].toString(),{
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Content-type" : "x-www-form-urlencoded"
        }
    }).then((res) => res.json()).then((jsonResponse) => {
        if(jsonResponse["result"]==false){
            result = false;
        }
        if(sub_endpoint=="/all"){
            newQues=[];
        }
        else{
            hotQues=[];
        }
        jsonResponse["details"].forEach(element => {
            let queBlock = document.createElement("div");
            let redirectLink = `/question?id=${element['_id']}`;
            let tile = getQuestionTile(element["title"],element["description"],redirectLink,sub_endpoint=="/all" ? `Total : ${element["views"]} views` : `This month: ${element["newlyViews"]} views`);
            if(sub_endpoint=="/all"){
                newQues.push(tile);
            }
            else{
                hotQues.push(tile);
            }
            result = true;
            // askedQues.appendChild(tile);
        });
    });
    return result;
}

function whichTabToProceed(){
    if(newTab.classList.length==2) return 0;
    return 1;
}

nextBtn.addEventListener('click', async (e) => {
    let tab = whichTabToProceed();
    pages[tab]++;
    let result = await getQuestions(tab==0 ? "/all" : "/hot");
    if(!result){
        pages[tab]--;
        return;
    }
    askedQues.innerHTML=null;
    if(tab==0) newQues.forEach(element => askedQues.appendChild(element));
    else hotQues.forEach(element => askedQues.appendChild(element));
});

previousBtn.addEventListener('click', async (e) => {
    let tab = whichTabToProceed();
    if(pages[tab]==1) return;
    pages[tab]--;
    let result = await getQuestions(tab==0 ? "/all" : "/hot");
    if(!result){
        pages[tab]++;
        return;
    }
    askedQues.innerHTML=null;
    if(tab==0) newQues.forEach(element => askedQues.appendChild(element));
    else hotQues.forEach(element => askedQues.appendChild(element));
    // if(tab==0) newTab.click();
    // else hotTab.click();
});

let userAuth = checkLogin();
if(!userAuth){
    throw new Error("User not authenticated");
};

getQuestions("/all").then(() => {
    newQues.forEach(element => askedQues.appendChild(element))
});
getQuestions("/hot");