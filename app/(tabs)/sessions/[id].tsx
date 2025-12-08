import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Calc = {
  id: string;
  volume: number;
};

export default function SessionDetailScreen() {
  const { id, date, name } = useLocalSearchParams();

  const [calculations, setCalculations] = useState<Calc[]>([]);

  const totalVolume = calculations.reduce((sum, c) => sum + c.volume, 0);

  const addCalculation = () => {
    // navigate to calculator, then come back with result
    router.push({
      pathname: "/volume",
      params: { sessionId: id },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name || "Hogst-sesjon"}</Text>

      <Text style={styles.date}>📅 {date}</Text>

      <FlatList
        style={{ maxHeight: 250 }}
        data={calculations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Ingen kalkulasjoner enda</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <MaterialCommunityIcons name="tree" size={22} color="#6fbf73" />
            <Text style={styles.rowText}>
              {item.volume.toFixed(3)} m³
            </Text>
          </View>
        )}
      />

      <Text style={styles.total}>
        Total: {totalVolume.toFixed(3)} m³
      </Text>

      <TouchableOpacity style={styles.button} onPress={addCalculation}>
        <MaterialCommunityIcons name="plus-circle" size={26} color="#fff" />
        <Text style={styles.buttonText}>Legg til kalkulasjon</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    color: "#aaa",
    marginBottom: 20,
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  rowText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 18,
  },
  total: {
    marginTop: 20,
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backBtn: {
    marginTop: 30,
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
