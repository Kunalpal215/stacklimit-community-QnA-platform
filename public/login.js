const user_email = document.getElementById("user_email");
const btn = document.getElementById("submit-button");
const user_password = document.getElementById("user_password");

function validateForm(){
    if(!user_email.value){
        alert("useremail cannot be null");
        return false;
    }
    if(!user_password.value){
        alert("password cannot be null");
        return false;
    }
    return true;
}


btn.addEventListener('click', () => {
    if(!validateForm()) return;
    console.log(user_email.value);
    fetch("https://stormy-lake-92165.herokuapp.com/login", {
        method: "POST",
        body: JSON.stringify({
            useremail: user_email.value.trim(),
            userpassword: user_password.value.trim(),
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => res.json()).then(jsonResponse => {
            if (jsonResponse["result"] === "Loggedin Successfully") {
                window.location.href = "/";
            }
            else {
                window.alert("Username or password maybe incorrect");
            }
        });
});