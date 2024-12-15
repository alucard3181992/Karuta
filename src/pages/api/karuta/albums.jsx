import { db } from '@/lib/utils';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Configuración de Multer para manejo de archivos
const uploadDir = 'F:/Imagenes/karuta/albumes';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const albumName = req.body.name.replace(/\s+/g, '_'); // Sustituir espacios por guiones bajos
        cb(null, `${albumName}${extension}`);
    },
});

const upload = multer({ storage });

export const config = {
    api: {
        bodyParser: false, // Desactivar bodyParser para manejar archivos manualmente
    },
};

export default function handler(req, res) {
    if (req.method === 'POST') {
        upload.single('background_image')(req, res, async (err) => {
            if (err) {
                console.error('Error al subir la imagen:', err);
                return res.status(500).json({ message: 'Error al subir la imagen.' });
            }

            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'El nombre del álbum es obligatorio.' });
            }

            // Ruta de la imagen de fondo (opcional)
            /* const backgroundImagePath = req.file
                ? path.join(uploadDir, `${req.file.filename}.jpg`)
                : null;
 */
                const originalFilePath = req.file.path;
                const newFilePath = path.join(uploadDir, `${name}.jpg`);

            try {
                // Insertar datos en la base de datos
                fs.renameSync(originalFilePath, newFilePath);
                const query = `
                    INSERT INTO albums (name, background_image, created_at, updated_at)
                    VALUES ($1, $2, NOW(), NOW())
                    RETURNING *;
                `;
                const values = [name, newFilePath];
                const result = await db.query(query, values);

                res.status(201).json({ message: 'Álbum creado exitosamente.'});
            } catch (dbError) {
                console.error('Error al registrar el álbum en la base de datos:', dbError);

                // Eliminar la imagen si ocurre un error
                if (backgroundImagePath && fs.existsSync(backgroundImagePath)) {
                    fs.unlinkSync(backgroundImagePath);
                }

                res.status(500).json({ message: 'Error al registrar el álbum en la base de datos.' });
            }
        });
    } else {
        res.status(405).json({ message: 'Método no permitido.' });
    }
}
