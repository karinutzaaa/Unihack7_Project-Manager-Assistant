  import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

  import PageFooter from "./project/components/PageFooter";
import Toolbar from "./project/components/Toolbar_department";

  import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";



  const { width } = Dimensions.get("window");
  const CARD_MARGIN = 12;
  const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

  const sampleProjects = [
    { id: "1", name: "Bridge Structural Analysis", description: "Finite element modeling of a suspension bridge.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60", progress: 46, deadline: "2025-12-01", color: "#FF6B6B" },
     ];

  export default function HomeScreen() {
    const params = useLocalSearchParams();
    const [projects, setProjects] = useState<any[]>(sampleProjects);

    useEffect(() => {
      if (params.updatedProject) {
        try {
          const upd = JSON.parse(decodeURIComponent(String(params.updatedProject)));
          setProjects((prev) => prev.map((p) => (String(p.id) === String(upd.id) ? { ...p, ...upd } : p)));
          router.replace({ pathname: "/" } as any);
        } catch { }
      }
    }, [params.updatedProject]);

    const renderProject = ({ item }: { item: any }) => (
      <Link href={`/project/ProjectPage?id=${item.id}`} asChild>
        <TouchableOpacity style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );

    const derivedDepartments = React.useMemo(() => {
      const fromProjects: Set<string> = new Set();
      projects.forEach((p) => {
        if (Array.isArray(p.departments)) p.departments.forEach((d: string) => fromProjects.add(d));
        if (p.department) fromProjects.add(p.department);
      });
      return fromProjects.size > 0 ? Array.from(fromProjects) : [
        "Design Mecanic",
      ];
    }, [projects]);

    return (
      <SafeAreaView style={styles.container}>
        {/* Toolbar */}
        <Toolbar />

        {/* Projects List */}
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              {/* Projects Summary */}
              <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Projects Summary</Text>
                <FlatList
                  data={projects}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingHorizontal: 12 }}
                  renderItem={({ item }) => {
                    const safePercent = Math.max(0, Math.min(100, Number(item.progress) || 0));
                    return (
                      <Link href={`/project/AnalyticsPage?projectId=${item.id}`} asChild>
                        <TouchableOpacity style={styles.summaryCard}>
                          <Text style={styles.summaryName} numberOfLines={1}>{item.name}</Text>
                          <View style={styles.summaryRow}>
                            <View style={styles.smallProgressBackground}>
                              <View style={[styles.smallProgressFill, { width: `${safePercent}%` }]} />
                            </View>
                            <Text style={styles.summaryPercent}>{safePercent}%</Text>
                          </View>
                          <Text style={styles.deadlineText}>Deadline: {item.deadline}</Text>
                        </TouchableOpacity>
                      </Link>
                    );
                  }}
                />
              </View>

              {/* All Projects Header */}
              <View style={styles.projectsHeader}>
                <Text style={styles.sectionTitle}>All Projects</Text>
                <Text style={styles.sectionSubtitle}>{projects.length} projects</Text>
              </View>
            </>
          )}
          ListFooterComponent={() => (
            <View style={styles.calendarSection}>
              {/* Departments Section */}
              <View style={styles.departmentsSection}>
                <Text style={styles.sectionTitle}>Departments</Text>
                <Text style={styles.sectionSubtitle}>Browse by team</Text>
                <FlatList
                  data={derivedDepartments}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item}
                  contentContainerStyle={{ paddingHorizontal: 12 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.departmentCard}
                      onPress={() => {
                        try {
                          const payload = encodeURIComponent(
                            JSON.stringify(
                              projects.map((p) => ({ id: p.id, name: p.name, color: p.color, deadline: p.deadline, progress: p.progress, departments: p.departments }))
                            )
                          );
                          router.push({ pathname: "/project/DepartmentsPage", params: { department: item, projects: payload } } as any);
                        } catch {
                          router.push({ pathname: "/project/DepartmentsPage", params: { department: item } } as any);
                        }
                      }}
                    >
                      <Text style={styles.departmentName}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Calendar Section */}
              <Text style={styles.sectionTitle}>Project Deadlines</Text>
              <Text style={styles.sectionSubtitle}>See upcoming deadlines on the calendar</Text>
              <View style={styles.calendarWrapper}>
                <Calendar
                  onDayPress={(day) => {
                    const date = day.dateString;
                    try {
                      const payload = encodeURIComponent(JSON.stringify(projects.map((p) => ({ id: p.id, name: p.name, color: p.color, deadline: p.deadline }))));
                      router.push({ pathname: "/project/CalendarDay", params: { date, projects: payload } } as any);
                    } catch {
                      router.push({ pathname: "/project/CalendarDay", params: { date } } as any);
                    }
                  }}
                  markingType="multi-dot"
                  markedDates={(() => {
                    const marks: Record<string, any> = {};
                    projects.forEach((p) => { if (!p.deadline) return; if (!marks[p.deadline]) marks[p.deadline] = { dots: [] }; marks[p.deadline].dots.push({ key: p.id, color: p.color || "#999" }); });
                    return marks;
                  })()}
                  style={styles.calendar}
                />
              </View>

              {/* Footer */}
              <PageFooter />
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#EEF3F9" },
    row: { justifyContent: "space-between", marginBottom: CARD_MARGIN },
    card: { width: CARD_WIDTH, backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, paddingHorizontal: 10, },
    cardImage: { width: "100%", height: 140 },
    cardContent: { padding: 10, backgroundColor: "#F7FAFF", paddingHorizontal: 10, },
    cardTitle: { fontSize: 15, fontWeight: "600", color: "#1C1C1E", marginBottom: 4 },
    cardDescription: { fontSize: 13, color: "#6B6B6B" },
    summarySection: { paddingVertical: 12 },
    summaryCard: { width: 220, backgroundColor: "#fff", borderRadius: 12, padding: 12, marginRight: 10, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
    summaryName: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 8 },
    summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    smallProgressBackground: { flex: 1, height: 8, backgroundColor: "#eee", borderRadius: 6, marginRight: 8, overflow: "hidden" },
    smallProgressFill: { height: "100%", backgroundColor: "#1b18b6" },
    summaryPercent: { width: 44, fontWeight: "700", color: "#1C1C1E" },
    deadlineText: { color: "#666", fontSize: 12 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0F1724", paddingHorizontal: 16, marginBottom: 6 },
    sectionSubtitle: { fontSize: 13, color: "#6B7280", paddingHorizontal: 16, marginBottom: 12 },
    projectsHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12, marginVertical: 8 },
    calendarSection: { paddingHorizontal: 12, paddingBottom: 24 },
    calendarWrapper: { borderRadius: 12, overflow: "hidden", marginVertical: 12 },
    calendar: { borderRadius: 12 },
    departmentsSection: { paddingVertical: 12 },
    departmentCard: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginRight: 10, elevation: 2 },
    departmentName: { fontSize: 14, fontWeight: "700", color: "#1b18b6" },
  });