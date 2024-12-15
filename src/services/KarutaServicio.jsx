//carpeta services
import axios from "axios";
import { baseUrl } from "@/lib/ip";

export class KarutaServicio {
  async listarKaruta() {
    const datos = await axios.get(baseUrl + "api/karuta/karuta");
    return datos.data;
  }
  async listarEconomia() {
    const datos = await axios.get(baseUrl + "api/karuta/economy");
    return datos.data;
  }
  async listarTrabajo() {
    const datos = await axios.get(baseUrl + "api/karuta/work");
    return datos.data;
  }
  async listarAlbum() {
    const datos = await axios.get(baseUrl + "api/karuta/album/lista");
    return datos.data;
  }
  async create(karuta) {
    return await axios.post(baseUrl + "api/karuta/agregarCarta", karuta);
  }
  async modificar(karuta, telefono) {
    return await axios.put(baseUrl + "api/clientes/karuta", {
      karuta,
      telefono,
    });
  }
  async eliminar(karuta) {
    console.log("HOLIS", karuta);
    return await axios.delete(baseUrl + "api/karuta/eliminarCarta", {
      data: { karuta },
    });
  }
}
