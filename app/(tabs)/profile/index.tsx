import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useProfile } from "@/lib/profile";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { getProfile, saveProfile } = useProfile();

  const [navn, setNavn] = useState("");
  const [kommune, setKommune] = useState("");
  const [gårdsNr, setGårdsNr] = useState("");
  const [bruksNr, setBruksNr] = useState("");
  const [leverandørNr, setLeverandørNr] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const p = await getProfile();
    if (p) {
      setNavn(p.navn ?? "");
      setKommune(String(p.kommune_nummer ?? ""));
      setGårdsNr(String(p.gårds_nummer ?? ""));
      setBruksNr(String(p.bruks_nummer ?? ""));
      setLeverandørNr(String(p.leverandør_nummer ?? ""));
    }
  }

  async function save() {
    await saveProfile({
      navn,
      kommune_nummer: Number(kommune) || null,
      gårds_nummer: Number(gårdsNr) || null,
      bruks_nummer: Number(bruksNr) || null,
      leverandør_nummer: Number(leverandørNr) || null,
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <Field label="Navn" value={navn} onChange={setNavn} />
      <Field label="Kommune nr" value={kommune} onChange={setKommune} />
      <Field label="Gårds nr" value={gårdsNr} onChange={setGårdsNr} />
      <Field label="Bruks nr" value={bruksNr} onChange={setBruksNr} />
      <Field label="Leverandør nr" value={leverandørNr} onChange={setLeverandørNr} />

      <TouchableOpacity style={styles.button} onPress={save}>
        <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
        <Text style={styles.buttonText}>Lagre Profil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  title: { color: "#fff", fontSize: 26, marginBottom: 20, fontWeight: "bold" },
  label: { color: "#bbb", marginBottom: 6 },
  input: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { marginLeft: 10, color: "#fff", fontSize: 18 },
});
