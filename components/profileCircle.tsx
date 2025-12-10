import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import WoodAvatar from "@/assets/avatars/wood-sunset.svg";
import WoodAvatar2 from "@/assets/avatars/wood-purple.svg";
import WoodAvatar3 from "@/assets/avatars/wood-orange.svg";
import WoodAvatar4 from "@/assets/avatars/axe-green.svg";
import WoodAvatar5 from "@/assets/avatars/axe-orange.svg";


type Props = {
  name: string | null;
  leverandørNr?: number | null;
  onPress?: () => void;
};

export default function ProfileCircle({ name, leverandørNr, onPress }: Props) {
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  const hasUser = !!name;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>

      {/* --- CIRCLE --- */}
      <View style={styles.circle}>
        {hasUser ? (
          <WoodAvatar width={30} height={30} />
        ) : (
          <Text style={styles.initials}>{initials}</Text>
        )}
      </View>

      {/* --- TEXT --- */}
      <View style={{ alignItems: "flex-start", gap: 2 }}>
        <Text style={styles.name}>@{name || "Ukjent bruker"}</Text>
        {leverandørNr && (
          <Text style={styles.leverandørNr}>
            Leverandør: {leverandørNr}
          </Text>
        )}
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 20,
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

  initials: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
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
