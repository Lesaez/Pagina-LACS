/* ================= MOSTRAR / OCULTAR PASSWORD ================= */

function togglePassword(id){

const input = document.getElementById(id);

if(input.type === "password"){
input.type = "text";
}else{
input.type = "password";
}

}


/* ================= SEGURIDAD CONTRASEÑA ================= */

const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strength");

passwordInput.addEventListener("input",()=>{

const password = passwordInput.value;

let score = 0;

if(password.length >= 8) score++;
if(/[A-Z]/.test(password)) score++;
if(/[0-9]/.test(password)) score++;
if(/[!@#$%^&*]/.test(password)) score++;

if(score <= 1){

strengthText.textContent = "Seguridad: Débil";
strengthText.className = "password-strength strength-weak";

}
else if(score <= 3){

strengthText.textContent = "Seguridad: Media";
strengthText.className = "password-strength strength-medium";

}
else{

strengthText.textContent = "Seguridad: Fuerte";
strengthText.className = "password-strength strength-strong";

}

});


/* ================= REGISTRO ================= */

document.getElementById("registerForm").addEventListener("submit", async (e)=>{

e.preventDefault();

const nombre = document.getElementById("nombre").value;
const telefono = document.getElementById("telefono").value;
const email = document.getElementById("email").value;

const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;


/* validar contraseñas */

if(password !== confirmPassword){

alert("Las contraseñas no coinciden");
return;

}


/* validar longitud */

if(password.length < 8){

alert("La contraseña debe tener al menos 8 caracteres");
return;

}


/* validar dominio */

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