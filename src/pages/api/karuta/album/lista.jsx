import { db } from '@/lib/utils';


export default async function handler(req, res) {
    if (req.method === 'GET') {
        console.log("SI ME LLAMAN A ALBUM LISTA");
        try {
            const query = 'SELECT * FROM albums ORDER BY created_at DESC;';
            const result = await db.query(query);

            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Error al obtener los álbumes:', err);
            res.status(500).json({ message: 'Error al obtener los álbumes.' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido.' });
    }
}
