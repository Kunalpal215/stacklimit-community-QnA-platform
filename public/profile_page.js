let userID = location.href.split("/")[5];

let useremail;
async function checkLogin(){
    await fetch("https://infinite-cliffs-51192.herokuapp.com/check_login",{
        method: "GET",
        credentials: "same-origin"
    }).then((res) => res.json()).then((jsonResponse) => {
        if(jsonResponse["result"] === "token expired" || jsonResponse["result"] === "no token passed"){
            window.location.href = "/auth_page";
            return false;
        }
        useremail = jsonResponse["result"];
        return true;
    });
}

checkLogin();



