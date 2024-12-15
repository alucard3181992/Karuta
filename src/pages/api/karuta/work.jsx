import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await db.query(
        "SELECT * FROM karuta_worker_details ORDER BY id DESC"
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
