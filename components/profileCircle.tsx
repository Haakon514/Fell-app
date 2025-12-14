import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";  // ⭐ ADD THIS
import WoodAvatar from "@/assets/avatars/wood-sunset.svg";

type Props = {
  name: string | null;
  leverandørNr?: number | null;
  onPress?: () => void;
};

export default function ProfileCircle({ name, leverandørNr, onPress }: Props) {
  const hasUser = !!name;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* --- CIRCLE --- */}
      <View style={styles.circle}>
        {hasUser ? (
          <WoodAvatar width={30} height={30} />
        ) : (
          <MaterialCommunityIcons 
            name="account" 
            size={28} 
            color="#fff" 
          />  // ⭐ Show PERSON ICON instead of ??
        )}
      </View>

      {/* --- TEXT --- */}
      <View style={{ alignItems: "flex-start", gap: 2 }}>
        <Text style={styles.name}>@{name || "Anonym bruker"}</Text>

        {leverandørNr && (
          <Text style={styles.leverandørNr}>Leverandør: {leverandørNr}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
  },

  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4e4b4bff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  name: {
    marginLeft: 10,
    fontSize: 15,
    color: "#ccc",
    fontWeight: "500",
  },

  leverandørNr: {
    marginLeft: 10,
    fontSize: 15,
    color: "#fff",
    fontWeight: "800",
  },
});
