import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      // Extraer los datos del cuerpo de la solicitud
      const { karuta } = req.body;

      // Validar que se envíen los campos necesarios
      if (!karuta || !karuta.id || !karuta.code) {
        return res
          .status(400)
          .json({ message: "Faltan datos necesarios para eliminar la carta" });
      }

      // Realizar la consulta a la base de datos
      const query = `
          DELETE FROM karuta_cards
          WHERE id = $1 AND code = $2
        `;
      const values = [karuta.id, karuta.code];

      // Ejecutar la consulta
      await db.query(query, values);

      // Responder con éxito
      return res.status(200).json({ message: "Carta eliminada correctamente" });
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
