import { useSQLiteContext } from "expo-sqlite";
import { Profile } from "@/types/profile";

export function useProfile() {
  const db = useSQLiteContext();

  async function getProfile() {
    return await db.getFirstAsync<Profile>("SELECT * FROM profile WHERE id = 1");
  }

  async function saveProfile(Profile: {
    navn: string;
    kommune_nummer: number | null;
    gårds_nummer: number | null;
    bruks_nummer: number | null;
    leverandør_nummer: number | null;
  }) {
    await db.runAsync(
      `INSERT OR REPLACE INTO profile 
        (id, navn, kommune_nummer, gårds_nummer, bruks_nummer, leverandør_nummer)
       VALUES (1, ?, ?, ?, ?, ?)`,
      [
        Profile.navn,
        Profile.kommune_nummer,
        Profile.gårds_nummer,
        Profile.bruks_nummer,
        Profile.leverandør_nummer,
      ]
    );
  }

  return { getProfile, saveProfile };
}
