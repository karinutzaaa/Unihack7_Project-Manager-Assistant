import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import BurgerMenu from "./burger-menu-manager";

export default function CommunityHub() {
  const [open, setOpen] = useState(false);

  // Date exemplu
  const project = { name: "Community Hub", description: "Welcome to the community hub" };
  const progressPercent = 72;
  const tasks = ["Task 1", "Task 2", "Task 3", "Task 4"];
  const completedTasks = 2;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* HEADER TOOLBAR */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.toolbarContainer}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/project/manager/pages-manager/manager-log-page")}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.iconButton} onPress={() => { }} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* OVERLAY PENTRU ÎNCHIDERE BURGER */}
      {open && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
      )}

      {/* MENIUL BURGER */}
      {open && <BurgerMenu closeMenu={() => setOpen(false)} />}

      {/* HEADER KPI */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>{project.name}</Text>
        <Text style={styles.headerSubtitle}>{project.description}</Text>

        <View style={styles.topKpiRow}>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Progress</Text>
            <Text style={styles.topKpiValue}>{progressPercent}%</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Tasks</Text>
            <Text style={styles.topKpiValue}>{tasks.length}</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Completed</Text>
            <Text style={styles.topKpiValue}>{completedTasks}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* GRID BUTTONS */}
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: "#3B82F6" }]}
          onPress={() => router.push("./community-page-manager")}
        >
          <Text style={styles.buttonEmoji}>🎯</Text>
          <Text style={styles.buttonText}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: "#10B981" }]}
          onPress={() => router.push("./birthdays-page-manager")}
        >
          <Text style={styles.buttonEmoji}>🎂</Text>
          <Text style={styles.buttonText}>Birthdays</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: "#F59E0B" }]}
          onPress={() => router.push("./company-awards-page-manager")}
        >
          <Text style={styles.buttonEmoji}>🏆</Text>
          <Text style={styles.buttonText}>Company Awards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: "#EF4444" }]}
          onPress={() => router.push("./announcements-page-manager")}
        >
          <Text style={styles.buttonEmoji}>📢</Text>
          <Text style={styles.buttonText}>Announcements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallRectButton, { backgroundColor: "#8B5CF6" }]}
          onPress={() => router.push("./meetings-page-manager")}
        >
          <Text style={styles.buttonEmoji}>💻</Text>
          <Text style={styles.buttonText}>Meetings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /*TOOLBAR*/
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toolbarTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 9,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 44 : 20,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
    elevation: 6,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" },
  headerSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 6, textAlign: "center" },
  topKpiRow: { flexDirection: "row", marginTop: 14, justifyContent: "space-between" },
  topKpi: { flex: 1, alignItems: "center" },
  topKpiLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  topKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  smallButton: {
    width: "20%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
  },
  smallRectButton: {
    width: "80%",
    height: 180,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
  },
  buttonEmoji: { fontSize: 28, marginBottom: 4 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 12, textAlign: "center" },
});
