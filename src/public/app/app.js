const socket = io();
document.querySelector("[data-btn-send]").addEventListener("click", ()=> {
    let message = document.querySelector("[data-message]").value;
});
socket.on("socketData", (data) => {
    document.querySelector("[data-ip]").innerHTML = data.ip;
    document.querySelector("[data-status]").classList.remove("text-danger");
    document.querySelector("[data-status]").classList.add("text-success");
    document.querySelector("[data-status-text]").innerHTML = "Conectado";
    document.querySelector("[data-rol]").innerHTML = data.rol;
    document.querySelector("[data-port]").innerHTML = data.port;
});
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
document.querySelector("[data-btn-send]").addEventListener('click',()=>{
    const input = document.querySelector("[data-message]");
    const message = input.value;
    if(message != ""){socket.emit("message",{message});}
    else{return;}
    const eMensaje = document.createElement("li");
    eMensaje.innerHTML = message;
    eMensaje.classList.add("list-group-item");
    eMensaje.classList.add("list-group-item-dark");
    eMensaje.classList.add("text-break");
    eMensaje.classList.add("mb-1");
    document.querySelector("[data-register-send]").appendChild(eMensaje);
    input.value = "";
});
document.querySelector("[data-btn-reset-register-message]").addEventListener('click',()=>{
    document.querySelector("[data-register-message]").innerHTML = "";
    document.querySelector("[data-btn-reset-register-message]").setAttribute("hidden",true);
});
document.querySelector("[data-btn-reset]").addEventListener('click',()=>{
    document.querySelector("[data-register-send]").innerHTML = "";
});