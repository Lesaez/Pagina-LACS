function togglePassword(btn,id){

const input = document.getElementById(id);

if(input.type === "password"){

input.type = "text";
btn.innerText = "🙈";

}else{

input.type = "password";
btn.innerText = "👁";

}

}

function setError(input,message){

input.classList.remove("input-success");
input.classList.add("input-error");

}

function setSuccess(input){

input.classList.remove("input-error");
input.classList.add("input-success");

}