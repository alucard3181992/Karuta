import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { album_page_id, card_code, position, pagina } = req.body;
    if (!album_page_id || !card_code || !position || !pagina) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    try {
      // Verificar si la posición ya está ocupada
      /* const checkQuery = `
                SELECT id FROM album_page_cards 
                WHERE album_page_id = $1 AND position = $2;
            `;
      const checkResult = await db.query(checkQuery, [album_page_id, position]);

      if (checkResult.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "La posición ya está ocupada." });
      } */

      // Insertar la carta en la página y posición
      const insertQuery = `
                INSERT INTO album_page_cards (album_page_id, card_code, position, pagina)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
      const insertResult = await db.query(insertQuery, [
        album_page_id,
        card_code,
        position,
        pagina
      ]);

      res.status(201).json({
        message: "Carta agregada exitosamente.",
        data: insertResult.rows[0],
      });
    } catch (err) {
      console.error("Error al agregar la carta:", err);
      res.status(500).json({ message: "Error al agregar la carta." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
