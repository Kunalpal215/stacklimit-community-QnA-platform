const titleElement = document.getElementById("queTitle");
const descpElement = document.getElementById("queDescp");
const imageInput = document.getElementById("formImage");
const submitBtn = document.getElementById("submit_btn");
const profileBtn = document.getElementById("profile-btn");
let email="";
async function checkLogin(){
    await fetch("http://localhost:3000/check_login",{
        method: "GET",
        credentials: "include"
    }).then((res) => res.json()).then((jsonResponse) => {
        if(jsonResponse["result"] === "token expired" || jsonResponse["result"] === "no token passed"){
            window.location.href = "/auth_page";
            return false;
        }
        email=jsonResponse["result"];
        profileBtn.setAttribute("href","../user/get/" + email);
        return true;
    });
}
function validateForm(){
    if(!titleElement.value){
        alert("title cannot be null");
        return false;
    }
    if(!descpElement.value){
        alert("descp cannot be null");
        return false;
    }
    return true;
}

submitBtn.addEventListener('click',async (e) => {
    e.preventDefault();
    let validate = validateForm();
    if(validate){
        let imageLink="";
        if(imageInput.files.length>0){
            let imageFile = imageInput.files[0];
            let formData = new FormData();
            formData.append("myFile",imageFile);
            await fetch('http://localhost:3000/image/upload',{
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
        fetch("http://localhost:3000/question/ask",{
            method: "POST",
            credentials: 'same-origin',
            body: JSON.stringify({
                title : titleElement.value,
                description : descpElement.value,
                imageLink : imageLink
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => res.json()).then((jsonResponse) => {
            if(jsonResponse["saved"]===true){
                alert("your question got added");
                window.location.href = "/";
                return;
            }
            else{
                alert(jsonResponse["message"] ?? "An error occured while saving the question");
                if(jsonResponse["message"]){
                    window.location.href = "/auth_page";
                }
            }
        });
    }
});

if(!checkLogin()){
    
};
