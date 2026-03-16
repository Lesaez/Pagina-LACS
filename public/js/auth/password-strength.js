document.addEventListener("DOMContentLoaded", () => {

const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const strengthContainer = document.querySelector(".password-strength-container");

if(!passwordInput) return;

passwordInput.addEventListener("input",()=>{

const password = passwordInput.value;

/* mostrar barra solo si hay texto */

if(password.length > 0){
strengthContainer.style.display = "flex";
}else{
strengthContainer.style.display = "none";
return;
}

let score = 0;

if(password.length >= 8) score++;
if(/[A-Z]/.test(password)) score++;
if(/[0-9]/.test(password)) score++;
if(/[!@#$%^&*]/.test(password)) score++;

if(score <= 1){

strengthBar.style.width = "25%";
strengthBar.style.background = "#ef4444";
strengthText.innerText = "Débil";

}
else if(score <= 3){

strengthBar.style.width = "60%";
strengthBar.style.background = "#f59e0b";
strengthText.innerText = "Media";

}
else{

strengthBar.style.width = "100%";
strengthBar.style.background = "#22c55e";
strengthText.innerText = "Fuerte";

}

});

});