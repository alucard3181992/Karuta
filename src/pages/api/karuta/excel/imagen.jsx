import { db } from "@/lib/utils";
import multer from "multer";
import fs from "fs";
import path from "path";

// Configuración de multer para guardar archivos temporales
const uploadDir = "F:/Imagenes/karuta";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

export const config = {
  api: {
    bodyParser: false, // Necesario para usar multer
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
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

        // Verificar si la carta existe
        const checkCardQuery = `
          SELECT id FROM karuta_cards WHERE code = $1;
        `;
        const checkCardResult = await db.query(checkCardQuery, [code]);

        if (checkCardResult.rows.length === 0) {
          // Si no existe, retornar error
          return res.status(404).json({ message: "Carta no encontrada." });
        }

        // Actualizar el campo image_path
        const updateQuery = `
          UPDATE karuta_cards
          SET image_path = $1
          WHERE code = $2;
        `;
        await db.query(updateQuery, [newFilePath, code]);

        res.status(200).json({ message: "Imagen actualizada exitosamente." });
      } catch (dbError) {
        console.error(dbError);

        // Eliminar el archivo si ocurre un error en la base de datos
        if (fs.existsSync(newFilePath)) {
          fs.unlinkSync(newFilePath);
        }

        res
          .status(500)
          .json({
            message: "Error al actualizar la imagen en la base de datos.",
          });
      }
    });
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
