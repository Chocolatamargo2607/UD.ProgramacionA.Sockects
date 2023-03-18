import  express  from "express";
import  {Server as WebSocketServer}  from "socket.io";
import http from "http";
import {fileURLToPath} from "url";
import path from "path";
import {status} from "./admIP.js";
import readline from "readline";
import { Socket } from "dgram";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Configucion del servidor
const SERVER = status()||'127.0.0.1';
const PORT = 3000;
const app = express();
const httpSer = http.createServer(app);//Instancia http para socket.io con express
const io = new WebSocketServer(httpSer);//Instancia de socket.io, la conn con el servidor
const sockets = [];//Array de sockets
//Coneccion con el cliente
io.on("connection", (socket) => {
	console.log(`Socket conectado: ${socket.handshake.address}`);

	let index = sockets.findIndex((s) => s.handshake.address === socket.handshake.address );

	if (index === -1) {sockets.push(socket);} 
	else {sockets[index] = socket;}

	//Detecta un socket conectado al servidor y emite una respuesta imediata
	socket.emit("socketData", {
		ip: socket.handshake.address,
		port: PORT,
		rol: socket.handshake.address == SERVER ? "Servidor" : "Cliente", //Definiendo rol del socket entrante
	});

	socket.on("message", (data) => {
		let servidor = sockets.find((s) => s.handshake.address == SERVER);
		if(socket.handshake.address == SERVER){
			sockets.forEach((c) => {
				if(c.handshake.address != SERVER){
					c.emit("messageServer",data.message);
					console.log(`Mensaje Enviado a: `,c.handshake.address)
				}
			});
		}else{
			console.log(`Mensaje en buzon\n${data.message}`);
			servidor.handshake.address?servidor.emit("messageServer",data.message):console.log('Servidor no encontrado');
			console.log(`Mensaje Enviado a: `,servidor.handshake.address)
		}
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