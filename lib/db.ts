import { useSQLiteContext } from "expo-sqlite";

export function useDB() {
  return useSQLiteContext();
}
