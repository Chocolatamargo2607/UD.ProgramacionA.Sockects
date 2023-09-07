import  express  from "express";
import  {Server as WebSocketServer}  from "socket.io";
import http from "http";
import {fileURLToPath} from "url";
import path from "path";
import {ethernetIP,ethernet2IP} from "./admIP.js";
import readline from "readline";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Configución del servidor
const SERVER = ethernetIP() || ethernet2IP();
const PORT = 8080;
const app = express();
const httpSer = http.createServer(app);//Instancia http para socket.io con express
const io = new WebSocketServer(httpSer);//Instancia de socket.io, con el servidor
const sockets = [];//Array de sockets

//Conección con el cliente
io.on("connection", (socket) => {
	console.log(`Socket conectado: ${socket.handshake.address}`);
	socket.on("name",data=>{
		console.log(data)
	    let index = sockets.findIndex((s) => s.socket.handshake.address === socket.handshake.address );
		var newObject = sockets[index]
		newObject.nombre = data
		sockets[index] = newObject
		updateData(socket,data)
	})

	let index = sockets.findIndex((s) => s.socket.handshake.address === socket.handshake.address );

	if (index === -1) {sockets.push({socket,nombre :null});} 
	else {sockets[index] = {socket,nombre:null};}

	//Detecta un socket conectado al servidor y emite una respuesta imediata
	function updateData(socket,data){
		socket.emit("socketData", {
			ip: socket.handshake.address,
			port: PORT,
			rol: socket.handshake.address == SERVER ? "Servidor" : "Cliente", //Definiendo rol del socket entrante
			nombre: data
		});
	}
	

	socket.on("message", (data) => {
		let servidor = sockets.find((s) => s.socket.handshake.address == SERVER);
			sockets.forEach((c) => {
					c.socket.emit("messageServer",data.message);
					console.log(`Mensaje Enviado a: `,c.socket.handshake.address)
			});
	});

	//Metodo enviar mensaje por consola
	rl.on("line", (input) => {
		if (socket.handshake.address != SERVER && input != "") {
			socket.emit("messageServer",input);
		}
	});
});



//Estableciendo la carpeta publica para los archivos estaticos(la carpeta de las vistas del cliente)

app.use(
	"/bootstrap",
	express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))
);

app.use(
	"/icons",
	express.static(
		path.join(__dirname, "../node_modules/bootstrap-icons/font")
	)
);

app.use(express.static(path.join(__dirname+"/public")));

//Configurando el puerto en donde se va ejecutar el servidor
httpSer.listen(PORT, SERVER, () => {
	console.log(`Servidor: ${SERVER}:${PORT}`);
});