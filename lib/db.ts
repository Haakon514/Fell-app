import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseAsync('tree-session');

// Create tables when imported
await db.execAsync(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS calculations (
    id TEXT PRIMARY KEY NOT NULL,
    sessionId TEXT NOT NULL,
    diameter REAL NOT NULL,
    height REAL NOT NULL,
    volume REAL NOT NULL
  );
`);

/*
 prepered statements
 inmeomory db
*/

//insert data into session
export async function insertSession(id: string, date: string, name?: string) {
  const result = await db.runAsync(
    "INSERT INTO sessions (id, date, name) VALUES (?, ?, ?)",
    id, date, name ?? null
  );

  return result.lastInsertRowId;
}

// insert data into calculations
export async function insertCalculation(
  id: string,
  sessionId: string,
  diameter: number,
  height: number,
  volume: number
) {
  const result = await db.runAsync(
    `INSERT INTO calculations (id, sessionId, diameter, height, volume)
     VALUES (?, ?, ?, ?, ?)`,
    id, sessionId, diameter, height, volume
  );

  return result.lastInsertRowId;
}

//get the total volume of trees from a spesific session
export async function getTotalVolume(sessionId: string) {
  const volume = await db.getFirstAsync(
    "SELECT SUM(volume) AS total FROM calculations WHERE sessionId = ?",
    sessionId
  );

  return volume ?? 0;
}

// get all calculations from a specific session
export async function getCalculations(sessionId: string) {
  return await db.getAllAsync(
    "SELECT * FROM calculations WHERE sessionId = ?",
    sessionId
  );
}


