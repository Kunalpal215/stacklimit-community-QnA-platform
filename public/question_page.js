const answer = document.getElementById("answer");
const answers = document.getElementById("answers");
const imageInput = document.getElementById("formImage");
const submitBtn = document.getElementById("submit_btn");
const profileBtn = document.getElementById("profile-btn");
let useremail;
async function checkLogin(toRedirect){
    return await fetch("https://infinite-cliffs-51192.herokuapp.com/check_login",{
        method: "GET",
        credentials: "same-origin"
    }).then((res) => res.json()).then((jsonResponse) => {
        if(jsonResponse["result"] === "token expired" || jsonResponse["result"] === "no token passed"){
            if(toRedirect) window.location.href = "/auth_page";
            return false;
        }
        useremail = jsonResponse["result"];
        profileBtn.setAttribute("href","user/get/" + useremail);
        return true;
    });
}

async function getAnswers(){
    checkLogin(false);
    const id = window.location.href.split("=")[1];
    const url = "https://infinite-cliffs-51192.herokuapp.com/question/ans?id=" + id;
    return await fetch(url,{
        method: "GET",
        credentials: 'include',
    }).then((res) => res.json()).then((jsonResponse) => {
        jsonResponse["details"].forEach(element => {
            let wrapper = document.createElement("div");
            wrapper.setAttribute("class","card");
            let answerMainPart = document.createElement('div');
            answerMainPart.setAttribute("id","div-main");
            let usernameElement = document.createElement("div");
            usernameElement.innerText = element["username"];
            let answerTextElement = document.createElement("div");
            answerTextElement.innerText = element["answer"];
            let likeElement = document.createElement("img");
            if(element["likers"].includes(useremail)){
                likeElement.setAttribute("src","https://infinite-cliffs-51192.herokuapp.com/images/black-like.png");
            }
            else{
                likeElement.setAttribute("src","https://infinite-cliffs-51192.herokuapp.com/images/white-like.png");
            }
            likeElement.setAttribute("height","16");
            let likeArea = document.createElement("div");
            likeArea.appendChild(likeElement);
            let likesCounter = document.createElement("div");
            likesCounter.innerText = element["likes"];
            likeArea.appendChild(likesCounter);
            likeArea.addEventListener("click",async (e) => {
                let postURL = "https://infinite-cliffs-51192.herokuapp.com/question/ans/like?ansID=" + element["_id"];
                await fetch(postURL,{
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-type" : "x-www-form-urlencoded"
                    }
                })
                .then((resAns) => resAns.json())
                .then((ansJsonResponse) => {
                    if(ansJsonResponse["saved"] === 2){
                        likeElement.setAttribute("src","https://infinite-cliffs-51192.herokuapp.com/images/black-like.png");
                        likesCounter.innerText = ansJsonResponse["likes"];
                        likeArea.removeChild(likeArea.lastChild);
                        likeArea.removeChild(likeArea.lastChild);
                        likeArea.appendChild(likeElement);
                        likeArea.appendChild(likesCounter);
                    }
                    else if(ansJsonResponse["saved"] === 0){
                        alert("You need to login to continue");
                        window.location.href = "/auth_page";
                    }
                    else{
                        alert(ansJsonResponse["message"]);
                    }
                });
            });
            let imageForAns = document.createElement("img");
            if(element["imageLink"]!=""){
                imageForAns.classList.add("answer-image");
                imageForAns.setAttribute("src",element["imageLink"]);
                imageForAns.setAttribute("width","60%");
            }
            likeArea.setAttribute("class","like-area");
            let answerInfoArea = document.createElement("div");
            answerInfoArea.setAttribute("id","answer-info");
            usernameElement.style.fontWeight = "600";
            answerInfoArea.appendChild(usernameElement);
            answerInfoArea.appendChild(answerTextElement);
            answerMainPart.appendChild(likeArea);
            answerMainPart.appendChild(answerInfoArea);
            wrapper.appendChild(answerMainPart);
            wrapper.appendChild(imageForAns);
            answers.appendChild(wrapper);
        });
    });
}
getAnswers();

submitBtn.addEventListener('click',async (e) => {
    e.preventDefault();
    if(!answer.value) return;
    let userAuth = await checkLogin(true);
    if(!userAuth){
        alert("Login to continue");
    };
    let imageLink="";
    if(imageInput.files.length>0){
        let imageFile = imageInput.files[0];
        let formData = new FormData();
        formData.append("myFile",imageFile);
        await fetch('https://infinite-cliffs-51192.herokuapp.com/image/upload',{
            method: "POST",
            credentials: 'same-origin',
            body: formData
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
            if(jsonResponse["saved"]){
                alert("Your session expired");
                location.href = "/auth_page";
            }
            if(jsonResponse["result"]==false){
                alert("An error occured please try again");
                return;
            }
            else{
                imageLink = jsonResponse["link"];
            }
        });
    }
    const id = window.location.href.split("=")[1];
    const url = "https://infinite-cliffs-51192.herokuapp.com/question/ans?id=" + id;
    fetch(url,{
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({email : useremail,answer: answer.value,imageLink: imageLink}),
        headers: {
            "Content-type": "application/json"
        }
    }).then((res) => res.json()).then((jsonResponse) => {
        if(jsonResponse["saved"] === true){
            location.reload();
        }
        else{
            alert("cannot add your answer");
        }
    });
})