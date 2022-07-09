let userID = location.href.split("/")[5];
console.log(userID);

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
        console.log(jsonResponse["result"]);
        useremail = jsonResponse["result"];
        return true;
    });
}

checkLogin();



