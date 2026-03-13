document
.getElementById("loginForm")
.addEventListener("submit", async (e)=>{

e.preventDefault();

const email = document.getElementById("email");
const password = document.getElementById("password");

let valid = true;


/* ================= VALIDAR EMAIL ================= */

if(!email.value.endsWith("@uninorte.edu.co")){

setError(email,"Correo institucional inválido");
valid=false;

}else{

setSuccess(email);

}


/* ================= VALIDAR PASSWORD ================= */

if(password.value.length < 6){

setError(password,"Contraseña incorrecta");
valid=false;

}else{

setSuccess(password);

}

if(!valid) return;


/* ================= LOGIN ================= */

try{

const res = await fetch("/api/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email:email.value,
password:password.value

})

});


const data = await res.json();


if(res.ok){

/* guardar usuario */

localStorage.setItem("user", JSON.stringify(data.user));

/* redirigir */

window.location.href="home.html";

}else{

setError(password,"Correo o contraseña incorrectos");

}

}catch(error){

console.error(error);

alert("Error conectando con el servidor");

}

});