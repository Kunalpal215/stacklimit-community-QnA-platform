const username = document.getElementById("username");
        const user_email = document.getElementById("user_email");
        const user_password = document.getElementById("user_password");
        const btn = document.getElementById("submit-button");

function validateForm(){
    if(!username.value){
        alert("username cannot be null");
        return false;
    }
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

        btn.addEventListener('click',() => {
            if(!validateForm()) return;
            fetch("http://localhost:3000/signup",{
                method: "POST",
                body: JSON.stringify({
                    username: username.value.trim(),
                    useremail: user_email.value.trim(),
                    userpassword: user_password.value.trim(),
                }),
                headers: {
                    "Content-type": "application/json",
                },
            })
            .then(res => res.json()).then(jsonResponse => {
                if(jsonResponse["result"]==="Signed up Successfully"){
                    window.location.href = "/login";
                }
                else{
                    window.alert(jsonResponse["result"]);
                }
            });
        });