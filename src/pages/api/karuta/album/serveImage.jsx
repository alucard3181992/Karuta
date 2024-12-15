import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { imageName } = req.query;

    const imagePath = path.join('F:/Imagenes/karuta/albumes', imageName);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Imagen no encontrada');
    }

    res.setHeader('Content-Type', 'image/jpeg'); // Cambia si es PNG u otro formato
    const stream = fs.createReadStream(imagePath);
    stream.pipe(res);
}
