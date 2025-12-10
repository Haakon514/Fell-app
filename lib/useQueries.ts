import { Session } from "@/types/session";
import { useDB } from "./db";

export function useQueries() {
  const db = useDB();

  async function getUsers() {
    return await db.getAllAsync("SELECT * FROM users;");
  }

  async function getSessions() {
    return await db.getAllAsync("SELECT * FROM sessions;");
  }

  async function getSessionById(id: number) {
    return await db.getFirstAsync<Session>(
      "SELECT * FROM sessions WHERE id = ?;",
      [id]
    );
  }

  async function getTreeCalculations() {
    return await db.getAllAsync("SELECT * FROM treecalculations;");
  }

  return {
    getUsers,
    getSessions,
    getSessionById,
    getTreeCalculations,
  };
}
