import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

// A D1-shaped test double backed by a real in-memory SQLite database via
// Node's built-in node:sqlite, applying the literal migration SQL files.
// This exercises real SQL semantics (UNIQUE, ON CONFLICT DO UPDATE) rather
// than re-implementing them in JS, without requiring the Wrangler CLI.
export function createD1Double({ migrationsDir = path.resolve(new URL("../migrations", import.meta.url).pathname) } = {}) {
  const db = new DatabaseSync(":memory:");
  const files = fs.readdirSync(migrationsDir).filter((name) => name.endsWith(".sql")).sort();
  for (const file of files) db.exec(fs.readFileSync(path.join(migrationsDir, file), "utf8"));

  function bind(sql, args) {
    return {
      async run() {
        const info = db.prepare(sql).run(...args);
        return { success: true, meta: { last_row_id: info.lastInsertRowid, changes: info.changes } };
      },
      async all() {
        const results = db.prepare(sql).all(...args);
        return { success: true, results };
      },
      async first() {
        return db.prepare(sql).get(...args) ?? null;
      },
    };
  }

  return {
    prepare(sql) {
      return { bind: (...args) => bind(sql, args), run: () => bind(sql, []).run(), all: () => bind(sql, []).all() };
    },
    async batch(boundStatements) {
      const results = [];
      for (const statement of boundStatements) results.push(await statement.run());
      return results;
    },
    raw: db,
  };
}
