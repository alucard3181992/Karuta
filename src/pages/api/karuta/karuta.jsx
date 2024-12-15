import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      /* const result = await db.query(
        "SELECT * FROM karuta_cards ORDER BY created_at DESC"
      ); */
      const result = await db.query(
        `
        SELECT 
  kc.*, 
  COALESCE(kwd.effort, 0) AS effort,
  COALESCE(ke.gold, 0) AS gold
FROM karuta_cards kc
LEFT JOIN karuta_worker_details kwd 
  ON kc.id = kwd.card_id
LEFT JOIN karuta_economy ke 
  ON kc.id = ke.card_id
ORDER BY kc.created_at DESC
        `
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error al obtener las cartas:", error);
      res.status(500).json({ message: "Error al obtener los datos." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
