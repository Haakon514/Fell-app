import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import { AuthProvider } from "@/lib/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SQLiteProvider
        databaseName="fell.db"
        onInit={async (db) => {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,

              navn TEXT,
              email TEXT UNIQUE,

              passord_hash TEXT NOT NULL,
              salt TEXT NOT NULL,

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
        <SafeAreaView style={{ flex: 1 }}  edges={["bottom"]} >
          <StatusBar style="light" />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent", // 🔑 let screens paint their own background
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </SQLiteProvider>
    </AuthProvider>
  );
}
