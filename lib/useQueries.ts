import { Session } from "@/types/session";
import { useDB } from "./db";
import { appEvents } from "@/lib/events"; // ✅ add this

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

  // NOTE: your old guard prevented setting 0 volume (because 0 is falsy)
  async function setSessionTotalVolume(
    sessionId: number | null,
    new_total_volume: number | null
  ) {
    if (sessionId == null || new_total_volume == null) return;

    await db.runAsync(
      `UPDATE sessions
       SET total_volume = ?
       WHERE id = ?`,
      [new_total_volume, sessionId]
    );
  }

  // ✅ FIXED: delete calculation + recompute session total + emit update
  async function deleteTreeCalculation(id: number) {
    // 1) find session_id first
    const row = await db.getFirstAsync<{ session_id: number }>(
      `SELECT session_id FROM treecalculations WHERE id = ?`,
      [id]
    );
    if (!row?.session_id) return;

    const sessionId = row.session_id;

    // 2) delete calc
    await db.runAsync(`DELETE FROM treecalculations WHERE id = ?`, [id]);

    // 3) recompute total from remaining calcs
    const sumRow = await db.getFirstAsync<{ sum: number }>(
      `SELECT COALESCE(SUM(volum), 0) as sum
      FROM treecalculations
      WHERE session_id = ?`,
      [sessionId]
    );

    const newTotal = Number(sumRow?.sum ?? 0);

    // 4) update session total
    await db.runAsync(
      `UPDATE sessions SET total_volume = ? WHERE id = ?`,
      [newTotal, sessionId]
    );

    // 5) notify UI
    appEvents.emit("sessionUpdated");
  }

  // ✅ also: deleting a session should delete its calcs too (otherwise orphan rows)
  async function deleteAllCalculationsFromAGivenSession(id: number) {
    // delete children first
    await db.runAsync(`DELETE FROM treecalculations WHERE session_id = ?`, [id]);
    // then session
    await db.runAsync(`DELETE FROM sessions WHERE id = ?`, [id]);

    appEvents.emit("sessionUpdated");
  }

  return {
    getUsers,
    getSessions,
    getSessionById,
    getSessionsBetweenDates,
    setSessionTotalVolume,
    getTreeCalculations,
    deleteTreeCalculation,
    deleteAllCalculationsFromAGivenSession,
  };
}
