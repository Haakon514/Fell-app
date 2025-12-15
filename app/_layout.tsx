import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="fell_v2.db"
      onInit={async (db) => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY,
            navn TEXT,
            kommune_nummer INTEGER,
            gårds_nummer INTEGER,
            bruks_nummer INTEGER,
            leverandør_nummer INTEGER
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            navn TEXT,
            date TEXT,
            user_id INTEGER,
            total_volume REAL,
            FOREIGN KEY (user_id) REFERENCES users(id)
          );
          PRAGMA journal_mode=WAL;
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS treecalculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            sortiment_kode INTEGER,
            diameter REAL,
            lengde REAL,
            volum REAL,
            timestamp TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
          );
          PRAGMA journal_mode=WAL;
        `);
      }}
      options={{ useNewConnection: false }}
    >
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#111", // 🔑 let screens paint their own background
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
