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

type Calc = {
  diameter: string;
  length: string;
  sortimentCode: string;
  result: string;
};

export default function VolumeScreen() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const db = useSQLiteContext();
  const createSession = useCreateSession();
  const [diameter, setDiameter] = useState("");
  const [length, setLength] = useState("");
  const [sortimentCode, setSortimentCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [calculationsList, setCalculationsList] = useState<Calc[]>([]);
  const date_today = new Date().toISOString().slice(0, 10);

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
  };

  useEffect(() => {
    calculate();
  }, [diameter, length]);

  useEffect(() => {
    if (!sessionId){
      createOrGetSession();
    }
  }, []);

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
        result,
        new Date().toISOString().slice(0, 10),
      ]
    );

    setDiameter("");
    setLength("");
    setSortimentCode("");
    setResult(null);
  };

  const handleRemoveFromList = (index: number) => {
    setCalculationsList((list) => list.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <View>
        <Text style={{ color: "#818bd7ff", fontSize: 15, marginBottom: 10 }}>
          {sessionId ? `Kalkulasjoner lagret i Økt: ${date_today}` : "Ny økt vil bli opprettet ved første kalkulasjon"}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Sortiment kode"
        placeholderTextColor="#bbb"
        value={sortimentCode}
        onChangeText={setSortimentCode}
        keyboardType="numeric"
      />

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
          <MaterialCommunityIcons name="plus" size={25} color="#fff" />
          <Text style={styles.buttonLabel}>Legg til i liste</Text>
        </TouchableOpacity>

        {/* "MENU" BUTTON (clear list) */}
        <TouchableOpacity style={styles.addButton} onPress={() => setCalculationsList([])}>
          <MaterialCommunityIcons name="menu" size={30} color="#1c28b4ff" />
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

            <TouchableOpacity onPress={() => handleRemoveFromList(index)}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color="#ff6666"
              />
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: "#1c28b4ff",
    padding: 10,
    paddingHorizontal: 50,
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
    backgroundColor: "#a0a0a0ff",
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
  }
});
