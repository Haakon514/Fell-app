import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useProfile } from "@/lib/profile";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Profile } from "@/types/profile";

export default function ProfileScreen() {
  const { getProfile, saveProfile } = useProfile();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");

  // Form fields
  const [navn, setNavn] = useState("");
  const [kommune, setKommune] = useState("");
  const [gårdsNr, setGårdsNr] = useState("");
  const [bruksNr, setBruksNr] = useState("");
  const [leverandørNr, setLeverandørNr] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const p = await getProfile();
    setProfile(p);

    if (p) {
      setNavn(p.navn ?? "");
      setKommune(String(p.kommune_nummer ?? ""));
      setGårdsNr(String(p.gårds_nummer ?? ""));
      setBruksNr(String(p.bruks_nummer ?? ""));
      setLeverandørNr(String(p.leverandør_nummer ?? ""));
      setViewMode("view");
    } else {
      // No profile exists → go straight to edit mode
      setViewMode("edit");
    }
  }

  async function handleSave() {
    await saveProfile({
      navn,
      kommune_nummer: Number(kommune) || null,
      gårds_nummer: Number(gårdsNr) || null,
      bruks_nummer: Number(bruksNr) || null,
      leverandør_nummer: Number(leverandørNr) || null,
    });

    await loadProfile(); // refresh data
    setViewMode("view"); // switch to view mode after save
  }

  // -------------------------
  // VIEW MODE (Profile Display)
  // -------------------------
  if (viewMode === "view" && profile) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Din Profil</Text>

        <View style={styles.infoBox}>
          <ProfileRow label="Navn" value={profile.navn} />
          <ProfileRow label="Kommune nr" value={profile.kommune_nummer} />
          <ProfileRow label="Gårds nr" value={profile.gårds_nummer} />
          <ProfileRow label="Bruks nr" value={profile.bruks_nummer} />
          <ProfileRow label="Leverandør nr" value={profile.leverandør_nummer} />
        </View>

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => setViewMode("edit")}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
          <Text style={styles.editText}>Rediger Profil</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // -------------------------
  // EDIT MODE (Form)
  // -------------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rediger Profil</Text>

      <Field label="Navn" value={navn} onChange={setNavn} />
      <Field label="Kommune nr" value={kommune} onChange={setKommune} />
      <Field label="Gårds nr" value={gårdsNr} onChange={setGårdsNr} />
      <Field label="Bruks nr" value={bruksNr} onChange={setBruksNr} />
      <Field label="Leverandør nr" value={leverandørNr} onChange={setLeverandørNr} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
        <Text style={styles.saveText}>Lagre</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- COMPONENTS ---
function Field({ label, value, onChange }: any) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChange}
      />
    </>
  );
}

function ProfileRow({ label, value }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? "-"}</Text>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  title: { color: "#fff", fontSize: 26, marginBottom: 20, fontWeight: "bold" },

  // View Mode
  infoBox: {
    backgroundColor: "#1c1c1c",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  row: { marginBottom: 14 },
  rowLabel: { color: "#bbb", fontSize: 14 },
  rowValue: { color: "#fff", fontSize: 18, fontWeight: "600" },

  editButton: {
    flexDirection: "row",
    backgroundColor: "#3e4bff",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: { marginLeft: 8, color: "#fff", fontSize: 17, fontWeight: "600" },

  // Edit Mode
  label: { color: "#bbb", marginBottom: 4 },
  input: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: { marginLeft: 10, color: "#fff", fontSize: 18 },
});
