import { db } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método no permitido." });
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

  // Validar que los datos básicos están presentes
  if (
    !code ||
    !stars ||
    !card_number ||
    !version ||
    !anime_name ||
    !character_name
  ) {
    return res.status(400).json({
      message: "Faltan datos obligatorios para actualizar la carta.",
    });
  }

  try {
    // Iniciar transacción
    await db.query("BEGIN");

    // Actualizar datos básicos en `karuta_cards`
    const updateCardQuery = `
      UPDATE karuta_cards
      SET 
        stars = $1,
        card_number = $2,
        version = $3,
        anime_name = $4,
        character_name = $5,
        created_at = NOW()
      WHERE code = $6
      RETURNING id;
    `;
    const result = await db.query(updateCardQuery, [
      stars,
      card_number,
      version,
      anime_name,
      character_name,
      code,
    ]);

    if (result.rows.length === 0) {
      throw new Error("La carta especificada no existe.");
    }

    const cardId = result.rows[0].id;

    // Actualizar datos en `karuta_economy` si existen
    if (economy) {
      const { gold, dust, stars } = economy;

      const economyExistsQuery = `
  SELECT 1 FROM karuta_economy WHERE card_id = $1
`;
      const economyExists = await db.query(economyExistsQuery, [cardId]);

      if (economyExists.rows.length > 0) {
        // Actualizar si ya existe
        const updateEconomyQuery = `
    UPDATE karuta_economy
    SET gold = $2, dust = $3, stars = $4
    WHERE card_id = $1
  `;
        await db.query(updateEconomyQuery, [cardId, gold, dust, stars]);
      } else {
        // Insertar si no existe
        const insertEconomyQuery = `
    INSERT INTO karuta_economy (card_id, gold, dust, stars)
    VALUES ($1, $2, $3, $4)
  `;
        await db.query(insertEconomyQuery, [cardId, gold, dust, stars]);
      }
    }

    // Actualizar datos en `karuta_worker_details` si existen
    if (worker) {
      const { characterDetails, effort, healthStatus, effortModifiers } =
        worker;

      // Verifica si el registro ya existe
      const workerExistsQuery = `
        SELECT 1 FROM karuta_worker_details WHERE card_id = $1
      `;
      const workerExists = await db.query(workerExistsQuery, [cardId]);

      // Si el registro existe, actualizamos
      if (workerExists.rows.length > 0) {
        const updateWorkerQuery = `
          UPDATE karuta_worker_details
          SET 
            character_details = $2,
            effort = $3,
            health_status = $4,
            effort_modifiers = $5
          WHERE card_id = $1
        `;
        await db.query(updateWorkerQuery, [
          cardId,
          characterDetails,
          effort,
          healthStatus,
          effortModifiers, // Esto ya es un string JSON
        ]);
      } else {
        // Si no existe, lo insertamos
        const insertWorkerQuery = `
          INSERT INTO karuta_worker_details (card_id, character_details, effort, health_status, effort_modifiers)
          VALUES ($1, $2, $3, $4, $5)
        `;
        await db.query(insertWorkerQuery, [
          cardId,
          characterDetails,
          effort,
          healthStatus,
          effortModifiers, // Esto ya es un string JSON
        ]);
      }
    }

    // Confirmar transacción
    await db.query("COMMIT");

    res
      .status(200)
      .json({ message: "Datos de la carta actualizados exitosamente." });
  } catch (error) {
    // Revertir transacción en caso de error
    await db.query("ROLLBACK");
    console.error("Error al actualizar la carta:", error);
    res.status(500).json({ message: "Error al actualizar la carta." });
  }
}
