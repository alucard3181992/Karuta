import { db } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { data } = req.body;

  try {
    for (const economy of data) {
      const { card_id, gold, dust, stars } = economy;

      // Obtener ID de la carta
      const card = await db.query("SELECT id FROM karuta_cards WHERE code = $1", [card_id]);
      if (card.rows.length === 0) continue; // Saltar si la carta no existe

      const cardId = card.rows[0].id;

      // Verificar si ya existe economía para esta carta
      const existingEconomy = await db.query(
        "SELECT id FROM karuta_economy WHERE card_id = $1",
        [cardId]
      );

      if (existingEconomy.rows.length === 0) {
        // Insertar nueva economía
        await db.query(
          `INSERT INTO karuta_economy (card_id, gold, dust, stars)
           VALUES ($1, $2, $3, $4)`,
          [cardId, gold, dust, stars]
        );
      }
    }

    res.status(200).json({ message: "Economía procesada exitosamente." });
  } catch (error) {
    console.error("Error al procesar economía:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
