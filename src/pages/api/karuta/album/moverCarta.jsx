import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido." });
  }

  const { sourcePageId, sourcePosition, targetPageId, targetPosition } = req.body;

  if (
    !sourcePageId ||
    !sourcePosition ||
    !targetPageId ||
    !targetPosition
  ) {
    return res.status(400).json({ message: "Faltan parámetros obligatorios." });
  }

  try {
    // Comenzar una transacción
    await db.query("BEGIN");

    // Obtener información de las cartas en las posiciones involucradas
    const sourceCard = await db.query(
      `SELECT id, card_code FROM album_page_cards 
       WHERE album_page_id = $1 AND position = $2`,
      [sourcePageId, sourcePosition]
    );

    const targetCard = await db.query(
      `SELECT id, card_code FROM album_page_cards 
       WHERE album_page_id = $1 AND position = $2`,
      [targetPageId, targetPosition]
    );

    // Verificar si la posición de destino está vacía
    if (targetCard.rows.length === 0) {
      // Mover carta a posición vacía
      await db.query(
        `UPDATE album_page_cards 
         SET album_page_id = $1, position = $2, updated_at = now()
         WHERE id = $3`,
        [targetPageId, targetPosition, sourceCard.rows[0].id]
      );
    } else {
      // Intercambiar cartas entre posiciones
      await db.query(
        `UPDATE album_page_cards 
         SET album_page_id = $1, position = $2, updated_at = now()
         WHERE id = $3`,
        [targetPageId, targetPosition, sourceCard.rows[0].id]
      );

      await db.query(
        `UPDATE album_page_cards 
         SET album_page_id = $1, position = $2, updated_at = now()
         WHERE id = $3`,
        [sourcePageId, sourcePosition, targetCard.rows[0].id]
      );
    }

    // Confirmar transacción
    await db.query("COMMIT");

    res.status(200).json({ message: "Movimiento realizado con éxito." });
  } catch (error) {
    console.error("Error al mover cartas:", error);
    await db.query("ROLLBACK");
    res.status(500).json({ message: "Error al mover las cartas." });
  }
}
