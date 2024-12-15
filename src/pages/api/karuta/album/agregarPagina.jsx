import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { album_id, page_number } = req.body;

    // Validar que los campos necesarios están presentes
    if (!album_id || !page_number) {
      return res.status(400).json({
        message: "Se requieren los campos 'album_id' y 'page_number'.",
      });
    }

    try {
      const currentTime = new Date();

      // Insertar nueva página en la base de datos
      const result = await db.query(
        `
          INSERT INTO album_pages (album_id, page_number, created_at, updated_at)
          VALUES ($1, $2, $3, $4)
          RETURNING id, album_id, page_number, created_at, updated_at;
        `,
        [album_id, page_number, currentTime, currentTime]
      );

      if (result.rows.length === 0) {
        return res
          .status(500)
          .json({ message: "No se pudo agregar la página al álbum." });
      }

      res.status(201).json({
        message: "Página añadida al álbum exitosamente.",
        page: result.rows[0],
      });
    } catch (error) {
      console.error("Error al agregar página al álbum:", error);
      res.status(500).json({ message: "Error al agregar la página." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
