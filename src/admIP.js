//importa modulo OS para obtener informacion de red
import os from "os";
export function status(){
		const interfaces = os.networkInterfaces();
		const ethInterfaces = interfaces.eth0 || interfaces.Ethernet;//Dependiendo de que sistema operativo se este usando

		if (ethInterfaces) {
			const activeInterface = ethInterfaces.find(//find buscara en la array ifaces, la interfaz que cumpla con las condiciones
				(iface) =>
					iface.family === "IPv4" &&
					!iface.internal &&
					iface.mac !== "00:00:00:00:00:00"
			);
			if (activeInterface) {
                return activeInterface.address;
			} else {
				return false;
			}
		} else {
			return false;
		}

};
