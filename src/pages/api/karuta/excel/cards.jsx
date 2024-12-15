import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { data } = req.body;

  try {
    for (const card of data) {
      const {
        code,
        stars,
        card_number,
        version,
        anime_name,
        character_name,
        image_path,
      } = card;
      // Agregar símbolos al card_number y version
      const formattedCardNumber = `#${card_number}`; // Agregar el símbolo #
      const formattedVersion = `◈${version}`; // Agregar el símbolo ◈
      // Verificar si la carta ya existe
      const existingCard = await db.query(
        "SELECT id FROM karuta_cards WHERE code = $1",
        [code]
      );

      if (existingCard.rows.length === 0) {
        // Insertar nueva carta
        await db.query(
          `INSERT INTO karuta_cards (code, stars, card_number, version, anime_name, character_name, image_path)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            code,
            stars,
            formattedCardNumber,
            formattedVersion,
            anime_name,
            character_name,
            image_path,
          ]
        );
      }
    }

    res.status(200).json({ message: "Cartas procesadas exitosamente." });
  } catch (error) {
    console.error("Error al procesar cartas:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
