import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      // Extraer los datos del cuerpo de la solicitud
      const { album } = req.body;
      //console.log("ME LLAMAN ELIMINAR ALBUM", req.body.album);
      // Validar que se envíen los campos necesarios
      if (!album || !album.id || !album.name) {
        return res
          .status(400)
          .json({ message: "Faltan datos necesarios para eliminar el album" });
      }

      // Realizar la consulta a la base de datos
      const query = `
          DELETE FROM albums
          WHERE id = $1 AND name = $2
        `;
      const values = [album.id, album.name];

      // Ejecutar la consulta
      await db.query(query, values);

      // Responder con éxito
      return res.status(200).json({ message: "Album eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar la carta:", error);
      return res
        .status(500)
        .json({ message: "Error al eliminar la carta", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
