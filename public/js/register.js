document.getElementById("registerForm").addEventListener("submit", async (e)=>{

e.preventDefault();

const nombre = document.getElementById("nombre").value;
const telefono = document.getElementById("telefono").value;
const email = document.getElementById("email").value;

const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;

if(password !== confirmPassword){

alert("Las contraseñas no coinciden");
return;

}

if(password.length < 8){

alert("La contraseña debe tener al menos 8 caracteres");
return;

}

if(!email.endsWith("@uninorte.edu.co")){

alert("Solo correos @uninorte.edu.co");
return;

}

const res = await fetch("/api/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nombre,
telefono,
email,
password
})

});

const data = await res.json();

if(res.ok){

alert("Usuario registrado correctamente");

window.location.href="login.html";

}else{

alert(data.error);

}

});