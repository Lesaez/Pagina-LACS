/* ================= MOSTRAR / OCULTAR PASSWORD ================= */

function togglePassword(btn,id){

const input = document.getElementById(id);
const icon = btn.querySelector("img");

if(!input) return;

if(input.type === "password"){

input.type = "text";

if(icon){
icon.src = "assets/assets/eye-off.png";
}

}else{

input.type = "password";

if(icon){
icon.src = "assets/assets/eye.png";
}

}

}


/* ================= VALIDACIONES INPUT ================= */

function setError(input,message){

input.classList.remove("input-success");
input.classList.add("input-error");

}

function setSuccess(input){

input.classList.remove("input-error");
input.classList.add("input-success");

}                                                                   