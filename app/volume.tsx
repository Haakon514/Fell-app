import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCreateSession } from "@/lib/useCreateSession";
import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import ConfirmDeleteModal from "@/components/modals/confirmDeleteModal";
import { Picker } from "@react-native-picker/picker";

type Calc = {
  diameter: string;
  length: string;
  sortimentCode: string;
  result: string;
};

export default function VolumeScreen() {
  const [showModalToDeleteIndex, setShowModalToDeleteIndex] = useState(false);
  const [showModalToDeleteList, setShowModalToDeleteList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const db = useSQLiteContext();
  const createSession = useCreateSession();
  const [diameter, setDiameter] = useState("");
  const [length, setLength] = useState("");
  const [sortimentCode, setSortimentCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [calculationsList, setCalculationsList] = useState<Calc[]>([]);
  const date_today = new Date().toISOString().slice(0, 10);

  const SORTIMENT_LIST = [
    { label: "Sagtømmer Gran (SG)", value: "SG" },
    { label: "Sagtømmer Furu (SF)", value: "SF" },
    { label: "Sagtømmer Lauv (SL)", value: "SL" },
    { label: "Massevirke Gran (MG)", value: "MG" },
    { label: "Massevirke Furu (MF)", value: "MF" },
    { label: "Massevirke Lauv (ML)", value: "ML" },
    { label: "Bio Gran/Furu/Lauv (GFL)", value: "GFL" },
    { label: "Pallevirke Gran (PG)", value: "PG" },
    { label: "Pallevirke Furu (PF)", value: "PF" },
  ];

  /* helper functions bellow */

  async function createOrGetSession() {
    // try to get an existing session from SecureStore
    const existingSession = await SecureStore.getItemAsync("sessionId");

    // if not found, create new session
    if (!existingSession) {
      setSessionId(await createSession());
      return;
    }

    // if found, set sessionId to the existing session
    setSessionId(parseInt(existingSession));
  }

  function confirmDeleteIndex(index: number) {
    setSelectedIndex(index);
    setShowModalToDeleteIndex(true);
  }

  function handleDelete() {
    if (selectedIndex !== null) {
      // remove from list
      setCalculationsList((list) => list.filter((_, i) => i !== selectedIndex));
    }
    setShowModalToDeleteIndex(false);
  }

  function handleDeleteHoleList() {
    setCalculationsList([]);
    setShowModalToDeleteList(false);
  }

  const calculate = () => {
    const d = parseFloat(diameter);
    const l = parseFloat(length);

    if (isNaN(d) || isNaN(l)) {
      setResult(null);
      return;
    }

    const radius = d / 2 / 100;
    const volume = Math.PI * radius * radius * l;
    setResult(volume.toFixed(3) + " m³");
    setVolume(volume);
  };

  const handleAddToList = async () => {
    if (!result) return;

    const entry = { diameter, length, sortimentCode, result };
    setCalculationsList((prev) => [...prev, entry]);

    // 3. SAVE TO DATABASE
    db.runAsync(
      `INSERT INTO treecalculations (session_id, sortiment_kode, diameter, lengde, volum, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        sortimentCode,
        diameter,
        length,
        volume,
        new Date().toISOString().slice(0, 10),
      ]
    );

    setDiameter("");
    setLength("");
  };

  /* end of helper functions */

  useEffect(() => {
    calculate();
  }, [diameter, length]);

  useEffect(() => {
    if (!sessionId){
      createOrGetSession();
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <View>
        <Text style={{ color: "#afb5e3ff", fontSize: 14, marginBottom: 10 }}>
          {sessionId ? `Kalkulasjoner lagres i økt ${date_today}` : "Ny økt vil bli opprettet automatisk ved første kalkulasjon eller ny dato"}
        </Text>
      </View>

      {/* SORTIMENT DROPDOWN */}
      <View style={styles.dropdownBox}>
        <Text style={styles.dropdownLabel}>Sortiment (kode)</Text>

        <Picker
          selectedValue={sortimentCode}
          onValueChange={(val) => setSortimentCode(val)}
          dropdownIconColor="#fff"
          style={styles.dropdown}
        >
          <Picker.Item label="Velg sortiment" value=""/>

          {SORTIMENT_LIST.map((s) => (
            <Picker.Item key={s.value} label={s.label} value={s.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.metricsContainer}>
        <TextInput
          style={styles.metricsInput}
          placeholder="Diameter (cm)"
          placeholderTextColor="#bbb"
          value={diameter}
          onChangeText={setDiameter}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.metricsInput}
          placeholder="Lengde (m)"
          placeholderTextColor="#bbb"
          value={length}
          onChangeText={setLength}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>{result}</Text>
        <Text style={{ color: "#949494ff", fontSize: 12 }}>Totalt volum (m³)</Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* ADD */}
        <TouchableOpacity style={styles.button} onPress={handleAddToList}>
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
          <Text style={styles.buttonLabel}>Legg til kalkulasjon</Text>
        </TouchableOpacity>

        {/* "MENU" BUTTON (clear list) */}
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModalToDeleteList(true)}>
          <MaterialCommunityIcons name="trash-can-outline" size={30} color="#1c28b4ff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={calculationsList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>
              D{item.diameter}cm * L{item.length}m = {item.result} (SK: {item.sortimentCode})
            </Text>

            <TouchableOpacity onPress={() => confirmDeleteIndex(index)}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color="#6f2727ff"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Delete Confirmation Modals, better ways to do this but its ok for now */}
      <ConfirmDeleteModal
        visible={showModalToDeleteIndex}
        message="Vil du virkelig slette dette elementet?"
        onCancel={() => setShowModalToDeleteIndex(false)}
        onConfirm={handleDelete}
      />
      <ConfirmDeleteModal
        visible={showModalToDeleteList}
        message="Vil du virkelig slette hele listen?"
        onCancel={() => setShowModalToDeleteList(false)}
        onConfirm={handleDeleteHoleList}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  metricsInput: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#444",
  },
  resultBox: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#040831ff",
    padding: 10,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#07022dff",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  listItem: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  dropdownBox: {
    backgroundColor: "#333",
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  dropdownLabel: {
    color: "#bbb",
    fontSize: 14,
    marginLeft: 8,
    marginTop: 6,
  },
  dropdown: {
    color: "#fff",
    width: "100%",
  },
});
