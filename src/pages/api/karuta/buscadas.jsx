import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { rows } = await db.query("SELECT * FROM karuta_wishlist");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching buscadas:", error);
      res.status(500).json({ message: "Error fetching buscadas." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
