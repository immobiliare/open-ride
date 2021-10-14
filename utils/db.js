import { join } from "path";
import { LowSync, JSONFileSync } from "lowdb";

/**
 * Databases are softwares that allows to store and read data.
 * Applications uses database for data that needs to persist
 * and that are not temporary.
 */

const DB_FILE =
  process.env.NODE_ENV === "production" ? "db.json" : "db.develop.json";
const file = join(process.cwd(), DB_FILE);
const adapter = new JSONFileSync(file);
const db = new LowSync(adapter);

const DEFAULT_DB = { user: [], track: [] };

db.read();
db.data = db.data || DEFAULT_DB;
db.write();

export const write = () => db.write();

export const getDb = (modelName) => {
  if (!db.data[modelName]) {
    db.data[modelName] = [];
    db.write();
  }
  return db.data[modelName];
};
