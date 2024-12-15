import { db } from "@/lib/utils";


export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { code } = req.body;

    // Validar que el código esté presente
    if (!code) {
      return res.status(400).json({ message: "Faltan datos obligatorios (code)." });
    }

    try {
      // Obtener el registro de la carta por su código
      const selectQuery = `
        SELECT image_path FROM karuta_wishlist WHERE code = $1;
      `;
      const result = await db.query(selectQuery, [code]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Carta no encontrada." });
      }

      const imagePath = result.rows[0].image_path;

      // Eliminar el registro de la carta en la base de datos
      const deleteQuery = `
        DELETE FROM karuta_wishlist WHERE code = $1;
      `;
      await db.query(deleteQuery, [code]);

      res.status(200).json({ message: "Carta eliminada exitosamente." });
    } catch (error) {
      console.error("Error al eliminar la carta:", error);
      res.status(500).json({ message: "Error al eliminar la carta." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
