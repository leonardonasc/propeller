
const { Client } = require("pg");
const { config } = require("dotenv");

config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

 const result = await client.query(`
  SELECT
  pid,
  state,
  wait_event_type,
  wait_event,
  query
FROM pg_stat_activity
WHERE datname = current_database()
  AND pid <> pg_backend_pid()
  AND (state <> 'idle' OR wait_event IS NOT NULL);
`);

console.table(result.rows);

    console.table(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

main();
