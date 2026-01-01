import React, { useEffect, useState } from "react";
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
import { useQueries } from "@/lib/useQueries";
import { appEvents } from "@/lib/events";

type Calc = {
  id: number;
  diameter: string;
  length: string;
  sortimentCode: string;
  volume: number;
  result: string;
};

export default function VolumeScreen() {
  const [showModalToDeleteIndex, setShowModalToDeleteIndex] = useState(false);
  const [showModalToDeleteList, setShowModalToDeleteList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [totalVolume, setTotalVolume] = useState<number | null>(null);

  const db = useSQLiteContext();
  const { getSessionById, setSessionTotalVolume, deleteTreeCalculation } = useQueries();
  const createSession = useCreateSession();

  const [diameter, setDiameter] = useState("");
  const [length, setLength] = useState("");

  // ✅ required sortiment
  const [sortimentCode, setSortimentCode] = useState("");
  const [sortimentError, setSortimentError] = useState(false);
  const [sortimentTouched, setSortimentTouched] = useState(false);

  const [result, setResult] = useState<string | null>(null);
  const [volume, setVolume] = useState<number | null>(null);

  const [calculationsList, setCalculationsList] = useState<Calc[]>([]);
  const date_today = new Date().toISOString().slice(0, 10);

  const SORTIMENT_LIST = [
    { label: "Sagtømmer Gran (142)", value: "142" },
    { label: "Sagtømmer Furu (242)", value: "242" },
    { label: "Massevirke Gran (102)", value: "102" },
    { label: "Massevirke Furu (202)", value: "202" },
    { label: "Bio Gran/Furu/Lauv (932)", value: "932" },
    { label: "Pallevirke Gran (131)", value: "131" },
    { label: "Pallevirke Furu (231)", value: "231" },
  ];

  /* helper functions */

  async function createOrGetSession() {
    const existingSession = await SecureStore.getItemAsync("sessionId");

    if (!existingSession) {
      const createdId = await createSession();
      setSessionId(createdId);

      await SecureStore.setItemAsync("sessionId", createdId.toString());
      return;
    } else {
      const session = await getSessionById(parseInt(existingSession));
      setTotalVolume(session?.total_volume ?? 0);

      if (session?.date !== date_today) {
        const createdId = await createSession();
        setSessionId(createdId);
        setTotalVolume(0);

        await SecureStore.setItemAsync("sessionId", createdId.toString());
        return;
      }

      setSessionId(parseInt(existingSession));
    }
  }

  function confirmDeleteIndex(index: number) {
    setSelectedIndex(index);
    setShowModalToDeleteIndex(true);
  }

  // delete 1 item
  const handleDelete = async () => {
    if (selectedIndex !== null) {
      const item = calculationsList[selectedIndex];
      const new_total_volume = (totalVolume ?? 0) - item.volume;
      setTotalVolume(new_total_volume);

      await deleteTreeCalculation(item.id);
      await setSessionTotalVolume(sessionId, new_total_volume);

      appEvents.emit("sessionUpdated");

      setCalculationsList((list) => list.filter((_, i) => i !== selectedIndex));
    }
    setShowModalToDeleteIndex(false);
  };

  // delete whole list
  const handleDeleteHoleList = async () => {
    if (calculationsList.length === 0) return;

    const totalRemoved = calculationsList.reduce((sum, item) => sum + item.volume, 0);

    for (const item of calculationsList) {
      await deleteTreeCalculation(item.id);
    }

    const newTotal = (totalVolume ?? 0) - totalRemoved;
    await setSessionTotalVolume(sessionId, newTotal);

    appEvents.emit("sessionUpdated");

    setTotalVolume(newTotal);
    setCalculationsList([]);
    setShowModalToDeleteList(false);
  };

  // calculate
  const calculate = () => {
    const d = parseFloat(diameter);
    const l = parseFloat(length);

    if (isNaN(d) || isNaN(l)) {
      setResult(null);
      setVolume(null);
      return;
    }

    const radius = d / 2 / 100;
    const v = Math.PI * radius * radius * l;
    setResult(v.toFixed(3) + " m³");
    setVolume(v);
  };

  // ✅ add calculation (requires sortiment)
  const handleAddToList = async () => {
    if (!result || !volume) return;

    if (!sortimentCode) {
      setSortimentTouched(true);
      setSortimentError(true);
      return;
    }

    const insertResult = await db.runAsync(
      `INSERT INTO treecalculations (session_id, sortiment_kode, diameter, lengde, volum, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId, sortimentCode, diameter, length, volume, new Date().toISOString().slice(0, 10)]
    );

    const id = insertResult.lastInsertRowId;

    const new_total_volume = (totalVolume ?? 0) + volume;
    setTotalVolume(new_total_volume);

    await setSessionTotalVolume(sessionId, new_total_volume);

    const entry = { id, diameter, length, sortimentCode, volume, result };
    setCalculationsList((prev) => [...prev, entry]);

    appEvents.emit("sessionUpdated");

    setDiameter("");
    setLength("");
  };

  /* end of helper functions */

  useEffect(() => {
    calculate();
  }, [diameter, length]);

  useEffect(() => {
    if (!sessionId) {
      createOrGetSession();
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View>
        <Text style={{ color: "#4ade80", fontSize: 14, marginBottom: 10 }}>
          {sessionId
            ? `Kalkulasjoner lagres i økt ${date_today}`
            : "Ny økt vil bli opprettet automatisk ved første kalkulasjon eller ny dato"}
        </Text>
      </View>

      {/* SORTIMENT DROPDOWN */}
      <View style={[styles.dropdownBox, sortimentError && styles.dropdownBoxError]}>
        <Text style={styles.dropdownLabel}>Sortiment (kode)</Text>

        <Picker
          selectedValue={sortimentCode}
          onValueChange={(val) => {
            setSortimentTouched(true);
            setSortimentCode(val);
            if (val) setSortimentError(false);
          }}
          dropdownIconColor="#fff"
          style={styles.dropdown}
        >
          <Picker.Item label="Velg sortiment" value="" />
          {SORTIMENT_LIST.map((s) => (
            <Picker.Item key={s.value} label={s.label} value={s.value} />
          ))}
        </Picker>

        {sortimentError && (
          <Text style={styles.errorText}>Du må velge sortimentkode før du lagrer.</Text>
        )}
      </View>

      <View style={styles.metricsContainer}>
        <TextInput
          style={styles.metricsInput}
          placeholder="Diameter (cm)"
          placeholderTextColor="#bbb"
          value={diameter}
          onChangeText={(text) => {
            if (text === "") {
              setDiameter("");
              return;
            }
            const num = Number(text);
            if (isNaN(num) || num < 0) return;
            setDiameter(text);
          }}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.metricsInput}
          placeholder="Lengde (m)"
          placeholderTextColor="#bbb"
          value={length}
          onChangeText={(text) => {
            if (text === "") {
              setLength("");
              return;
            }
            const num = Number(text);
            if (isNaN(num) || num < 0) return;
            setLength(text);
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>{result}</Text>
        <Text style={{ color: "#949494ff", fontSize: 12 }}>Totalt volum (m³)</Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* ADD */}
        <TouchableOpacity
          style={[styles.button, (!sortimentCode || !result) && styles.buttonDisabled]}
          onPress={handleAddToList}
          activeOpacity={0.9}
          disabled={!sortimentCode || !result}
        >
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
          <Text style={styles.buttonLabel}>Lagre kalkulasjon</Text>
        </TouchableOpacity>

        {/* CLEAR LIST */}
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModalToDeleteList(true)}>
          <MaterialCommunityIcons name="trash-can-outline" size={30} color="#ff5533ff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Totalt volum for {date_today}</Text>
        <Text style={styles.summaryValue}>{totalVolume?.toFixed(2) || 0} m³</Text>
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
              <MaterialCommunityIcons name="trash-can-outline" size={22} color="#ff5533ff" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Delete Confirmation Modals */}
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
    backgroundColor: "#0f0f0f",
    paddingHorizontal: 20,
    paddingVertical: 36,
  },

  dropdownBox: {
    backgroundColor: "#151515",
    borderRadius: 14,
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  dropdownBoxError: {
    borderColor: "rgba(255, 60, 60, 0.7)",
    backgroundColor: "rgba(255, 60, 60, 0.06)",
  },
  dropdownLabel: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "600",
  },
  dropdown: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "700",
    paddingTop: 6,
    paddingLeft: 2,
  },

  metricsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  metricsInput: {
    flex: 1,
    backgroundColor: "#151515",
    color: "#fff",
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  resultBox: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  resultText: {
    color: "#4ade80",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  button: {
    flex: 1,
    backgroundColor: "#4ade80",
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#4ade80",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonLabel: {
    color: "#0f0f0f",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },

  addButton: {
    width: 60,
    backgroundColor: "#262626",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  summaryCard: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  summaryLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 2,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  listItem: {
    backgroundColor: "#151515",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  listText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
});
