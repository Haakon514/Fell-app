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

  async function getSessionsBetweenDates(startDate: string, endDate: string) {
    return await db.getAllAsync<Session[]>(
      `SELECT * FROM sessions
      WHERE date BETWEEN ? AND ?
      ORDER BY date ASC`,
      [startDate, endDate]
    );
  }

  async function getTreeCalculations() {
    return await db.getAllAsync("SELECT * FROM treecalculations;");
  }

  async function setSessionTotalVolume(sessionId: number | null, new_total_volume: number | null) {
    if(!sessionId || !new_total_volume) return;

    await db.runAsync(
      `UPDATE sessions
      SET total_volume = ?
      WHERE id = ?`,
      [new_total_volume, sessionId]
    );
  }

  async function deleteTreeCalculation(id: number){
    await db.runAsync(
      `DELETE FROM treecalculations WHERE id = ?`, [id]
    )
  }

  return {
    getUsers,
    getSessions,
    getSessionById,
    getSessionsBetweenDates,
    setSessionTotalVolume,
    getTreeCalculations,
    deleteTreeCalculation,
  };
}
