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

type Calc = {
  diameter: string;
  length: string;
  sortimentCode: string;
  result: string;
};

export default function VolumeScreen() {
  const [diameter, setDiameter] = useState("");
  const [length, setLength] = useState("");
  const [sortimentCode, setSortimentCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [calculationsList, setCalculationsList] = useState<Calc[]>([]);

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

  const handleAddToList = () => {
    if (!result) return;

    const entry = { diameter, length, sortimentCode, result };
    setCalculationsList((prev) => [...prev, entry]);

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
        <Text style={{ color: "#949494ff" }}>Totalt volum (m³)</Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* ADD */}
        <TouchableOpacity style={styles.button} onPress={handleAddToList}>
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
          <Text style={styles.buttonLabel}>Legg til i liste</Text>
        </TouchableOpacity>

        {/* "MENU" BUTTON (placeholder) */}
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
    padding: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#444",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#444",
  },
  resultBox: {
    backgroundColor: "#444",
    padding: 18,
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
    padding: 12,
    paddingHorizontal: 50,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#a0a0a0ff",
    padding: 12,
    paddingHorizontal: 16,
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
