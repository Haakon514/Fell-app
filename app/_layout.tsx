import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="fell.db"
      onInit={async (db) => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            navn TEXT,
            email TEXT,
            addresse TEXT,
            kommune_nummer INTEGER,
            gårds_nummer INTEGER,
            bruks_nummer INTEGER,
            leverandør_nummer INTEGER
          );
          PRAGMA journal_mode=WAL;
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            navn TEXT,
            date TEXT,
            user_id INTEGER,
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
      <Stack>
        {/* Tabs entry point */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Other pages outside tabs */}
        <Stack.Screen
          name="volume"
          options={{ title: "Trevolum" }}
        />

        <Stack.Screen
          name="sessions/new"
          options={{ title: "Ny sesjon" }}
        />

        <Stack.Screen
          name="sessions/[id]"
          options={{ title: "Sesjon" }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
