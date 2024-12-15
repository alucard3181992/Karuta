import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { card_id } = req.query;

    if (!card_id) {
      return res.status(400).json({ message: "Se requiere card_id" });
    }

    try {
      const result = await db.query(
        `
          SELECT 
            c.id AS card_id, c.character_name, c.anime_name, 
            e.gold, e.dust, e.stars AS economy_stars, 
            w.character_details, w.effort, w.health_status, w.effort_modifiers
          FROM karuta_cards c
          LEFT JOIN karuta_economy e ON c.id = e.card_id
          LEFT JOIN karuta_worker_details w ON c.id = w.card_id
          WHERE c.id = $1
          `,
        [card_id]
      );

      if (
        result.rows.length === 0 ||
        (!result.rows[0].gold && !result.rows[0].character_details)
      ) {
        return res
          .status(200)
          .json({ message: "No hay datos adicionales disponibles." });
      }

      const cardData = result.rows[0];
      if (cardData.effort_modifiers) {
        cardData.effort_modifiers = JSON.parse(cardData.effort_modifiers);
      }

      res.status(200).json(cardData);
    } catch (error) {
      console.error("Error al obtener detalles de la carta:", error);
      res.status(500).json({ message: "Error al obtener los datos." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
