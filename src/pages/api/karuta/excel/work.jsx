import { db } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { data } = req.body;

  try {
    for (const work of data) {
      const { card_id, character_details, effort } = work;

      // Obtener ID de la carta
      const card = await db.query("SELECT id FROM karuta_cards WHERE code = $1", [card_id]);
      if (card.rows.length === 0) continue; // Saltar si la carta no existe

      const cardId = card.rows[0].id;

      // Verificar si ya existe trabajo para esta carta
      const existingWork = await db.query(
        "SELECT id FROM karuta_worker_details WHERE card_id = $1",
        [cardId]
      );

      if (existingWork.rows.length === 0) {
        // Insertar nuevo trabajo
        await db.query(
          `INSERT INTO karuta_worker_details (card_id, character_details, effort, health_status, effort_modifiers)
           VALUES ($1, $2, $3, $4, $5)`,
          [cardId, character_details, effort, "Healthy", "{}"]
        );
      }
    }

    res.status(200).json({ message: "Trabajo procesado exitosamente." });
  } catch (error) {
    console.error("Error al procesar trabajo:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
