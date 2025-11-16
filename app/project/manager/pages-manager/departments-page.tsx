import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BurgerMenu from "./burger-menu-manager";

export default function DepartmentsPage() {
  const params = useLocalSearchParams();
  const department = String(params.department || "All Departments");
  const [open, setOpen] = useState(false);

  const [sortMode, setSortMode] =
    useState<"deptProgress" | "deadline" | "overall">("deptProgress");

  // Members (mock)
  const sampleMembers = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Carla" },
  ];

  // Incoming projects from previous page
  // --- STEP 1: load projects from previous page ---
  let incomingProjects: any[] = [];
  try {
    if (params.projects) {
      const parsed = JSON.parse(decodeURIComponent(String(params.projects)));
      if (Array.isArray(parsed)) incomingProjects = parsed;
    }
  } catch {
    incomingProjects = [];
  }

  // --- STEP 2: add DUMMY PROJECTS to make page feel alive ---
  const dummyProjects = [
    {
      id: "D1",
      name: "Fixture Alignment Upgrade",
      deadline: "2025-11-28",
      progress: 34,
      departments: ["Design Mecanic"],
      color: "#4FC3F7",
    },
    {
      id: "D2",
      name: "Electrical Bench Testing",
      deadline: "2025-12-02",
      progress: 62,
      departments: ["Design Electric", "Teste"],
      color: "#00A6FF",
    },
    {
      id: "D3",
      name: "Robot Arm Firmware Sync",
      deadline: null,
      progress: 15,
      departments: ["Software Debug"],
      color: "#2962FF",
    },
    {
      id: "D4",
      name: "Pneumatic Calibration Jig",
      deadline: "2025-12-12",
      progress: 78,
      departments: ["Tooling Shop", "Assamblare Mecanica"],
      color: "#177cc4",
    },
  ];

  // --- STEP 3: merge incoming + dummy ---
  const allProjects = [...incomingProjects, ...dummyProjects];


  // Filter by department
  const matchingProjects = allProjects.filter((p) => {
    if (!department || department === "All Departments") return true;
    if (Array.isArray(p.departments) && p.departments.includes(department))
      return true;
    if (p.department && p.department === department) return true;
    return false;
  });

  // 🔥 ENHANCEMENT: simulate backend activity to make the page feel alive
  const enhancedProjects = matchingProjects.map((p) => ({
    ...p,
    lastUpdate: [
      "Checked wiring",
      "Updated CAD model",
      "Reviewed specs",
      "Debugged controller",
      "Adjusted tooling",
    ][Math.floor(Math.random() * 5)],
    tasksTotal: 10,
    tasksDone: Math.floor((p.progress || 0) / 10),
  }));

  // Sorting logic
  const sortedProjects = useMemo(() => {
    const copy = [...enhancedProjects];
    if (sortMode === "deadline") {
      return copy.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return (
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
      });
    }
    return copy.sort(
      (a, b) => (Number(b.progress) || 0) - (Number(a.progress) || 0)
    );
  }, [enhancedProjects, sortMode]);

  // KPI — department progress
  const deptProgress = useMemo(() => {
    if (!matchingProjects || matchingProjects.length === 0) return 0;
    const total = matchingProjects.reduce(
      (acc, p) => acc + (Number(p.progress) || 0),
      0
    );
    return Math.round(total / matchingProjects.length);
  }, [matchingProjects]);

  // KPI — overall
  const overall = useMemo(() => {
    if (!incomingProjects || incomingProjects.length === 0) return 0;
    const total = incomingProjects.reduce(
      (acc, p) => acc + (Number(p.progress) || 0),
      0
    );
    return Math.round(total / incomingProjects.length);
  }, [incomingProjects]);

  // 🔥 KPI — next deadline
  const nextDeadline = useMemo(() => {
    const withDates = matchingProjects.filter((p) => !!p.deadline);
    if (!withDates.length) return "N/A";
    const soonest = withDates.sort(
      (a, b) =>
        new Date(a.deadline).getTime() -
        new Date(b.deadline).getTime()
    )[0];
    return soonest.deadline;
  }, [matchingProjects]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FB" }}>
      {/* Toolbar */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ padding: 6, marginRight: 8 }}
            onPress={() => setOpen(true)}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={{ padding: 6 }} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ padding: 6 }}>
          <Ionicons name="refresh" size={18} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Overlay */}
      {open && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setOpen(false)}
        />
      )}

      {open && <BurgerMenu closeMenu={() => setOpen(false)} />}

      {/* Header */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 0]}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <View style={styles.headerTitleBlock}>
          <Ionicons name="business-outline" size={26} color="#fff" />
          <Text style={styles.title}>{department}</Text>
        </View>

        <Text style={styles.memberCount}>
          {sampleMembers.length} team members
        </Text>

        <View style={styles.separator} />

        {/* KPIs */}
        <View style={styles.kpiRow}>
          <TouchableOpacity
            onPress={() => setSortMode("deptProgress")}
            style={styles.kpiBox}
          >
            <Text style={styles.kpiLabel}>Dept Progress</Text>
            <Text style={styles.kpiValue}>{deptProgress}%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortMode("deadline")}
            style={styles.kpiBox}
          >
            <Text style={styles.kpiLabel}>Next Deadline</Text>
            <Text style={styles.kpiValue}>{nextDeadline}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortMode("overall")}
            style={styles.kpiBox}
          >
            <Text style={styles.kpiLabel}>Overall</Text>
            <Text style={styles.kpiValue}>{overall}%</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Project List */}
      <FlatList
        data={sortedProjects}
        keyExtractor={(p) => String(p.id)}
        ListEmptyComponent={
          <Text style={styles.empty}>No projects for this department</Text>
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectCard}
            onPress={() =>
              router.push({
                pathname:
                  "/project/manager/pages-manager/project-page-manager",
                params: { id: item.id },
              })
            }
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.projectName}>{item.name}</Text>

              <Text style={styles.projectMeta}>
                <Ionicons name="calendar-outline" size={14} color="#666" />{" "}
                {item.deadline ?? "No deadline"}
              </Text>

              <Text style={styles.projectMetaSmall}>
                <Ionicons name="time-outline" size={13} color="#888" /> Last
                update: {item.lastUpdate}
              </Text>

              <Text style={styles.projectMetaSmall}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={13}
                  color="#4FC3F7"
                />{" "}
                {item.tasksDone}/{item.tasksTotal} tasks
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{item.progress ?? 0}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.progress ?? 0}%` },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

/* ------------------------- STYLES ---------------------------- */

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },

  headerTitleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  memberCount: {
    fontSize: 14,
    color: "#D0D4FF",
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 8,
  },

  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  kpiBox: {
    alignItems: "center",
    flex: 1,
  },

  kpiLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.9,
  },

  kpiValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },

  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  projectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b18b6",
  },

  projectMeta: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  projectMetaSmall: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  progressContainer: {
    width: 80,
    alignItems: "flex-end",
  },

  progressText: {
    fontWeight: "700",
    color: "#1b18b6",
    marginBottom: 4,
  },

  progressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#E6E8FF",
    borderRadius: 4,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1b18b6",
  },

  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
});
