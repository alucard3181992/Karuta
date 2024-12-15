import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { modificar, eliminar, agregar } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!modificar && !eliminar && !agregar) {
      return res.status(400).json({
        message: "Se requiere al menos una operación (modificar, eliminar o agregar).",
      });
    }

    try {
      // Registrar la hora actual
      const currentTime = new Date();

      // Transacción para garantizar consistencia en las operaciones
      await db.query("BEGIN");

      // Operación: Modificar
      if (modificar && modificar.length > 0) {
        for (const card of modificar) {
          await db.query(
            `
              UPDATE album_page_cards
              SET position = $1, updated_at = $2
              WHERE id = $3;
            `,
            [card.position, currentTime, card.page_card_id]
          );
        }
      }

      // Operación: Eliminar
      if (eliminar && eliminar.length > 0) {
        const idsToDelete = eliminar.map((card) => card.page_card_id);
        await db.query(
          `
            DELETE FROM album_page_cards
            WHERE id = ANY($1::int[]);
          `,
          [idsToDelete]
        );
      }

      // Operación: Agregar
      if (agregar && agregar.length > 0) {
        for (const card of agregar) {
          await db.query(
            `
              INSERT INTO album_page_cards (album_page_id, card_code, position, pagina, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6);
            `,
            [
              card.album_page_id,
              card.card_code,
              card.position,
              card.pagina,
              currentTime,
              currentTime,
            ]
          );
        }
      }

      // Confirmar transacción
      await db.query("COMMIT");

      res.status(200).json({
        message: "Operaciones realizadas con éxito.",
      });
    } catch (error) {
      // Revertir cambios en caso de error
      await db.query("ROLLBACK");
      console.error("Error al actualizar las cartas del álbum:", error);
      res.status(500).json({
        message: "Error al procesar las operaciones.",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({
      message: "Método no permitido.",
    });
  }
}
