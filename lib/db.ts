import { useSQLiteContext } from "expo-sqlite";

const db = useSQLiteContext();

// common database functions
export async function getUsers() {
  return await db.getAllAsync("SELECT * FROM users;");
}

export async function getSessions() {
  return await db.getAllAsync("SELECT * FROM sessions;");
}

export async function getTreeCalculations() {
  return await db.getAllAsync("SELECT * FROM treecalculations;");
}

