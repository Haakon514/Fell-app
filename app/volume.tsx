import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function VolumeScreen() {
  const [diameter, setDiameter] = useState("");
  const [length, setHeight] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const diameterCm = parseFloat(diameter);
    const lengthInMeters = parseFloat(length);

    if (isNaN(diameterCm) || isNaN(lengthInMeters)) return;

    const radiusCm = diameterCm / 2 / 100;
    const volume = Math.PI * radiusCm * radiusCm * lengthInMeters;

    setResult(volume.toFixed(3) + " m³");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tre-volum kalkulator 🌲</Text>

      <TextInput
        style={styles.input}
        placeholder="Diameter (cm)"
        placeholderTextColor="#bbb"
        value={diameter}
        onChangeText={setDiameter}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Høyde (m)"
        placeholderTextColor="#bbb"
        value={length}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={calculate}>
        <MaterialCommunityIcons name="calculator" size={24} color="#fff" />
        <Text style={styles.buttonText}>Beregn</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        <Text style={styles.backText}>Tilbake</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
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
  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resultBox: {
    marginTop: 10,
    backgroundColor: "#444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  resultText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  backBtn: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 18,
  },
});
