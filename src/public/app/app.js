const socket = io();
const staticBackdrop = document.getElementById('staticBackdrop');
const myInput = document.getElementById('myInput');

// Funcion para abiri el modal
function abrirModal() {
    const staticBackdrop = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    staticBackdrop.show();
}

// Ejecutar la función para abrir el modal automáticamente al cargar la página
window.addEventListener('DOMContentLoaded', abrirModal);


//Manejo del nombre del usuario
document.getElementById("submitName").addEventListener("click",()=>{
    Event.defaultPrevented
    if(document.getElementById("imputName").value == "") return
    socket.emit("name",document.getElementById("imputName").value)
    btn = document.getElementById("botonCerrarModal")
    btn.click()
    
})
//Obtencion del mensaje por medio del boton
document.querySelector("[data-btn-send]").addEventListener("click", ()=> {
    let message = document.querySelector("[data-message]").value;
});

//Actualiza la interfaz con los datos enviados por el servidor (Ip,Estado,Rol,Puerto,Nombre)
socket.on("socketData", (data) => {
    document.querySelector("[data-ip]").innerHTML = data.ip;
    document.querySelector("[data-status]").classList.remove("text-danger");
    document.querySelector("[data-status]").classList.add("text-success");
    document.querySelector("[data-status-text]").innerHTML = "Conectado";
    document.querySelector("[data-rol]").innerHTML = data.rol;
    document.querySelector("[data-port]").innerHTML = data.port;
    document.querySelector("[data-name]").innerHTML = data.nombre;
});

// El mensaje se agrega a la interfaz del usuario (servidor-cliente) como un elemento de lista
// manejo de los mensajes recibidos por el servidor 
socket.on("messageServer", (data) => {
    console.log('Mensaje recibido');
	const pMensaje = document.createElement("li");
    pMensaje.innerHTML = data;
    pMensaje.classList.add("list-group-item");
    pMensaje.classList.add("list-group-item-dark");
    pMensaje.classList.add("text-break");
    pMensaje.classList.add("mb-1");
    document.querySelector("[data-register-message]").appendChild(pMensaje);
    document
			.querySelector("[data-btn-reset-register-message]")
			.removeAttribute("hidden");
});

//Envia el mensaje escrito por el usuario con el boton enviar
document.querySelector("[data-btn-send]").addEventListener('click',()=>{
    const input = document.querySelector("[data-message]");
    var message = input.value;
    message = document.querySelector("[data-name]").innerHTML+": "+message
    if(message != ""){socket.emit("message",{message});}
    else{return;}
    const eMensaje = document.createElement("li");
    eMensaje.innerHTML = message;
    eMensaje.classList.add("list-group-item");
    eMensaje.classList.add("list-group-item-dark");
    eMensaje.classList.add("text-break");
    eMensaje.classList.add("mb-1");innerHTML+
    document.querySelector("[data-register-send]").appendChild(eMensaje);
    input.value = "";
});

// Borra todos los elementos de la lista de mensajes recibidos y enviados
document.querySelector("[data-btn-reset-register-message]").addEventListener('click',()=>{
    document.querySelector("[data-register-message]").innerHTML = "";
    document.querySelector("[data-btn-reset-register-message]").setAttribute("hidden",true);
});
document.querySelector("[data-btn-reset]").addEventListener('click',()=>{
    document.querySelector("[data-register-send]").innerHTML = "";
});