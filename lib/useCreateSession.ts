import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from "expo-secure-store";

export function useCreateSession() {
  const db = useSQLiteContext();

  async function createSession(): Promise<number> {
    const today = new Date().toISOString().slice(0, 10);
    const userId = await SecureStore.getItemAsync("user_id");

    try {
      const result = await db.runAsync(
        `INSERT INTO sessions (navn, date, user_id) VALUES (?, ?, ?)`,
        [null, today, userId ? Number(userId) : null]
      );

      // Return session id so you can save rows to it
      if (result.lastInsertRowId !== undefined && result.lastInsertRowId !== null) {
        return result.lastInsertRowId as number;
      }

      return -1;
    } catch (error) {
      console.error("Error creating session:", error);

      return -1;
    }
  }

  return createSession;
}
