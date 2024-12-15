import { db } from "@/lib/utils";
import multer from "multer";
import fs from "fs";
import path from "path";

// Configuración de multer para guardar archivos temporales
const uploadDir = "F:/Imagenes/karuta/buscadas";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar archivos con multer
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.error("Error al subir la imagen:", err);
        return res.status(500).json({ message: "Error al subir la imagen." });
      }

      const { code } = req.body;

      // Validar datos obligatorios
      if (!code) {
        return res
          .status(400)
          .json({ message: "Faltan datos obligatorios de la carta (code)." });
      }

      const originalFilePath = req.file.path;
      const newFilePath = path.join(uploadDir, `${code}.jpg`);

      try {
        // Renombrar el archivo con el formato y nombre deseados
        fs.renameSync(originalFilePath, newFilePath);

        // Insertar la carta en la tabla `karuta_buscadas`
        const insertQuery = `
          INSERT INTO karuta_wishlist (code, image_path, created_at)
          VALUES ($1, $2, now())
          RETURNING *;
        `;
        const values = [code, newFilePath];
        const result = await db.query(insertQuery, values);

        res
          .status(201)
          .json({ message: "Carta registrada exitosamente.", carta: result.rows[0] });
      } catch (dbError) {
        console.error("Error en la base de datos:", dbError);

        // Eliminar el archivo si ocurre un error en la base de datos
        if (fs.existsSync(newFilePath)) {
          fs.unlinkSync(newFilePath);
        }

        res.status(500).json({
          message: "Error al registrar la carta en la base de datos.",
        });
      }
    });
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
