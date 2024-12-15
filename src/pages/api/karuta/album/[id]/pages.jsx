import { db } from '@/lib/utils';

export default async function handler(req, res) {
    const { id } = req.query; // ID del álbum

    if (req.method === 'GET') {
        try {
            // Obtener las páginas del álbum
            const pagesQuery = `
                SELECT id, album_id, page_number, created_at, updated_at
                FROM album_pages
                WHERE album_id = $1
                ORDER BY page_number;
            `;
            const pagesResult = await db.query(pagesQuery, [id]);

            const pages = await Promise.all(
                pagesResult.rows.map(async (page) => {
                    // Obtener las cartas de cada página usando su album_page_id
                    const cardsQuery = `
                        SELECT 
                            apc.id AS page_card_id,
                            apc.position,
                            apc.pagina,
                            kc.id AS card_id,
                            kc.code AS card_code,
                            kc.character_name,
                            kc.anime_name,
                            kc.image_path
                        FROM album_page_cards apc
                        JOIN karuta_cards kc ON apc.card_code = kc.code
                        WHERE apc.album_page_id = $1
                        ORDER BY apc.position;
                    `;
                    const cardsResult = await db.query(cardsQuery, [page.id]);

                    return {
                        ...page,
                        cards: cardsResult.rows,
                    };
                })
            );

            res.status(200).json(pages);
        } catch (err) {
            console.error('Error al obtener las páginas:', err);
            res.status(500).json({ message: 'Error al obtener las páginas.' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido.' });
    }
}
