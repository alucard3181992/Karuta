/* import { db } from '@/lib/utils';
import multer from 'multer';
import fs from 'fs';
import path from 'path';


// Configuración de multer para guardar archivos temporales
const uploadDir = 'F:/Imagenes/karuta';
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
    if (req.method === 'POST') {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al subir la imagen.' });
            }

            const { code, stars, card_number, version, anime_name, character_name } = req.body;

            // Asegúrate de que todos los datos requeridos están presentes
            if (!code || !stars || !card_number || !version || !anime_name || !character_name) {
                return res.status(400).json({ message: 'Faltan datos obligatorios.' });
            }

            const originalFilePath = req.file.path;
            const newFilePath = path.join(uploadDir, `${code}.jpg`); // Cambiar la extensión si deseas otro formato

            try {
                // Renombrar el archivo con el formato y nombre deseados
                fs.renameSync(originalFilePath, newFilePath);

                // Inserción en la base de datos
                const query = `
                    INSERT INTO karuta_cards 
                    (code, stars, card_number, version, anime_name, character_name, image_path)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *;
                `;
                const values = [code, stars, card_number, version, anime_name, character_name, newFilePath];
                const result = await db.query(query, values);

                res.status(201).json({ message: 'Carta registrada exitosamente.', data: result.rows[0] });
            } catch (dbError) {
                console.error(dbError);

                // Eliminar el archivo si ocurre un error en la base de datos
                if (fs.existsSync(newFilePath)) {
                    fs.unlinkSync(newFilePath);
                }

                res.status(500).json({ message: 'Error al registrar en la base de datos.' });
            }
        });
    } else {
        res.status(405).json({ message: 'Método no permitido.' });
    }
}
 */ /*
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

      const {
        code,
        stars,
        card_number,
        version,
        anime_name,
        character_name,
        economy,
        worker,
      } = req.body;
      // Validar datos obligatorios de la carta
      if (
        !code ||
        !stars ||
        !card_number ||
        !version ||
        !anime_name ||
        !character_name
      ) {
        return res
          .status(400)
          .json({ message: "Faltan datos obligatorios de la carta." });
      }

      const originalFilePath = req.file.path;
      const newFilePath = path.join(uploadDir, `${code}.jpg`);

      try {
        // Renombrar el archivo con el formato y nombre deseados
        fs.renameSync(originalFilePath, newFilePath);

        // Inserción de la carta en `karuta_cards`
        const cardQuery = `
                    INSERT INTO karuta_cards 
                    (code, stars, card_number, version, anime_name, character_name, image_path)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id;
                `;
        const cardValues = [
          code,
          stars,
          card_number,
          version,
          anime_name,
          character_name,
          newFilePath,
        ];
        const cardResult = await db.query(cardQuery, cardValues);
        const cardId = cardResult.rows[0].id;

        // Procesar y guardar economía si está presente
        if (economy) {
          const goldMatch = economy.match(/💰\s*(\d+)\s*Gold/);
          const dustMatch = economy.match(/✨\s*(\d+)\s*Dust/);
          const starsMatch = economy.match(/\(([^)]+)\)/);

          const gold = goldMatch ? parseInt(goldMatch[1], 10) : 0;
          const dust = dustMatch ? parseInt(dustMatch[1], 10) : 0;
          const starsEconomy = starsMatch ? starsMatch[1] : "";

          const economyQuery = `
                        INSERT INTO karuta_economy
                        (card_id, gold, dust, stars)
                        VALUES ($1, $2, $3, $4);
                    `;
          const economyValues = [cardId, gold, dust, starsEconomy];
          await db.query(economyQuery, economyValues);
        }

        //trabajo
        if (worker) {
          console.log("SI HAY TRABAJO");
          const workerData2 = JSON.parse(worker);
          const {
            characterDetails,
            cardCode,
            effort,
            healthStatus,
            effortModifiers,
          } = workerData2;

          await db.query(
            `INSERT INTO karuta_worker_details 
             (card_id, character_details, effort, health_status, effort_modifiers) 
             VALUES ($1, $2, $3, $4, $5)`,
            [
              cardId,
              characterDetails,
              effort,
              healthStatus,
              JSON.stringify(effortModifiers), // Convertir effort_modifiers a texto
            ]
          );
        }
        res
          .status(201)
          .json({ message: "Carta registrada exitosamente." });
      } catch (dbError) {
        console.error(dbError);

        // Eliminar el archivo si ocurre un error en la base de datos
        if (fs.existsSync(newFilePath)) {
          fs.unlinkSync(newFilePath);
        }

        res
          .status(500)
          .json({ message: "Error al registrar en la base de datos." });
      }
    });
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
*/
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
        console.error("Error en Multer:", err);
        return res.status(500).json({ message: "Error al subir la imagen." });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se encontró el archivo 'image'." });
      }

      const {
        code,
        stars,
        card_number,
        version,
        anime_name,
        character_name,
        economy,
        worker,
      } = req.body;

      if (
        !code ||
        !stars ||
        !card_number ||
        !version ||
        !anime_name ||
        !character_name
      ) {
        return res
          .status(400)
          .json({ message: "Faltan datos obligatorios de la carta." });
      }

      const originalFilePath = req.file.path;
      const newFilePath = path.join(uploadDir, `${code}.jpg`);

      let responseSent = false; // Indicador para asegurar que se envíe una respuesta

      try {
        // Renombrar el archivo con el formato y nombre deseados
        fs.renameSync(originalFilePath, newFilePath);

        // Inserción de la carta en `karuta_cards`
        const cardQuery = `
          INSERT INTO karuta_cards 
          (code, stars, card_number, version, anime_name, character_name, image_path)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id;
        `;
        const cardValues = [
          code,
          stars,
          card_number,
          version,
          anime_name,
          character_name,
          newFilePath,
        ];
        const cardResult = await db.query(cardQuery, cardValues);
        const cardId = cardResult.rows[0].id;

        // Procesar y guardar economía si está presente
        if (economy) {
          const goldMatch = economy.match(/💰\s*(\d+)\s*Gold/);
          const dustMatch = economy.match(/✨\s*(\d+)\s*Dust/);
          const starsMatch = economy.match(/\(([^)]+)\)/);

          const gold = goldMatch ? parseInt(goldMatch[1], 10) : 0;
          const dust = dustMatch ? parseInt(dustMatch[1], 10) : 0;
          const starsEconomy = starsMatch ? starsMatch[1] : "";

          const economyQuery = `
            INSERT INTO karuta_economy
            (card_id, gold, dust, stars)
            VALUES ($1, $2, $3, $4);
          `;
          const economyValues = [cardId, gold, dust, starsEconomy];
          await db.query(economyQuery, economyValues);
        }

        // Procesar y guardar detalles de trabajo si están presentes
        if (worker) {
          const workerData = JSON.parse(worker);
          const { characterDetails, effort, healthStatus, effortModifiers } =
            workerData;

          const workerQuery = `
            INSERT INTO karuta_worker_details 
            (card_id, character_details, effort, health_status, effort_modifiers) 
            VALUES ($1, $2, $3, $4, $5);
          `;
          await db.query(workerQuery, [
            cardId,
            characterDetails,
            effort,
            healthStatus,
            JSON.stringify(effortModifiers),
          ]);
        }

        res
          .status(201)
          .json({ message: "Carta registrada exitosamente.", cardId });
        responseSent = true;
      } catch (dbError) {
        console.error(dbError);

        // Eliminar el archivo si ocurre un error en la base de datos
        if (fs.existsSync(newFilePath)) {
          fs.unlinkSync(newFilePath);
        }

        res
          .status(500)
          .json({ message: "Error al registrar en la base de datos." });
        responseSent = true;
      } finally {
        // Enviar una respuesta predeterminada si no se envió previamente
        if (!responseSent) {
          res
            .status(500)
            .json({ message: "Error inesperado. Solicitud no completada." });
        }
      }
    });
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
