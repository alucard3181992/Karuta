import { Pool } from "pg";

const pool = new Pool({
  user: "postgres", // Reemplaza con tu usuario de PostgreSQL
  host: "localhost", // Cambia si usas un host diferente
  database: "karuta", // Reemplaza con el nombre de tu base de datos
  password: "3181992", // Reemplaza con tu contraseña
  port: 5432, // El puerto por defecto de PostgreSQL
});

export const db = {
  query: (text, params) => pool.query(text, params),
};
