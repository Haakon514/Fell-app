import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Reglement() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Title */}
      <Text style={styles.title}>Sagstømmer</Text>
      <Text style={styles.subtitle}>Kappereglement</Text>

      {/* Table 1 */}
      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.headerCell}>Kontrakt</Text>
          <Text style={styles.headerCell}>Navn</Text>
          <View style={styles.headerGroup}>
            <Text style={styles.headerCell}>Diameter (cm ub)</Text>
            <View style={styles.subHeaderRow}>
              <Text style={styles.subHeaderCell}>Min</Text>
              <Text style={styles.subHeaderCell}>Maks</Text>
            </View>
          </View>
          <Text style={styles.headerCell}>Lengder (dm)</Text>
        </View>

        {/* Row 142 */}
        <View style={styles.row}>
          <Text style={styles.cell}>142</Text>
          <Text style={styles.cell}>Gran sagt</Text>
          <View style={styles.cellGroup}>
            <Text style={styles.cell}>13</Text>
            <Text style={styles.cell}>55</Text>
          </View>
          <Text style={styles.cell}>37, 43, 49, 52, 55</Text>
        </View>

        {/* Row 242 */}
        <View style={styles.row}>
          <Text style={styles.cell}>242</Text>
          <Text style={styles.cell}>Furu sagt</Text>
          <View style={styles.cellGroup}>
            <Text style={styles.cell}>13</Text>
            <Text style={styles.cell}>55</Text>
          </View>
          <Text style={styles.cell}>43, 49, 52, 55</Text>
        </View>
      </View>

      {/* Spacing */}
      <View style={{ height: 24 }} />

      {/* Title 2 */}
      <Text style={styles.subtitle}>Kappetabell – Normal lengdefordeling</Text>

      {/* Table 2 */}
      <View style={styles.lengthTable}>
        <View style={styles.lengthRow}>
          <View style={[styles.lengthBox, { backgroundColor: "#ff6b6b" }]}>
            <Text style={styles.lengthPercent}>10%</Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#ffa94d" }]}>
            <Text style={styles.lengthPercent}>30%</Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#51cf66" }]}>
            <Text style={styles.lengthPercent}></Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#51cf66" }]}>
            <Text style={styles.lengthPercent}>60%</Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#51cf66" }]}>
            <Text style={styles.lengthPercent}></Text>
          </View>
        </View>

        {/* Length values */}
        <View style={styles.lengthRow}>
          <View style={[styles.lengthBox, { backgroundColor: "#ff8787" }]}>
            <Text style={styles.lengthValue}>3,70 m</Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#ffd43b" }]}>
            <Text style={styles.lengthValue}>4,30 m</Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#69db7c" }]}>
            <Text style={styles.lengthValue}>4,90 m</Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#38b000" }]}>
            <Text style={styles.lengthValue}>5,20 m</Text>
          </View>
          <View style={[styles.lengthBox, { backgroundColor: "#2b9348" }]}>
            <Text style={styles.lengthValue}>5,50 m</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f7f7f7",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 10,
    color: "#444",
  },

  /* Table 1 */
  table: {
    borderWidth: 1,
    borderColor: "#2f9e44",
    borderRadius: 8,
    overflow: "hidden",
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#e9f5e9",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: "#2f9e44",
  },
  headerCell: {
    flex: 1,
    fontWeight: "700",
    fontSize: 13,
    color: "#2f9e44",
    textAlign: "center",
  },
  headerGroup: {
    flex: 1.3,
  },
  subHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  subHeaderCell: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2f9e44",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: "#cfcfcf",
    backgroundColor: "white",
  },

  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  cellGroup: {
    flex: 1.2,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  /* Length Table */
  lengthTable: {
    marginTop: 10,
  },
  lengthRow: {
    flexDirection: "row",
  },
  lengthBox: {
    flex: 1,
    marginTop: 4,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  lengthPercent: {
    fontWeight: "700",
    fontSize: 16,
    color: "white",
  },
  lengthValue: {
    fontWeight: "800",
    fontSize: 16,
    color: "white",
  },
});
