import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerMenu from "./burger-menu-manager";

export default function CalendarDay() {
    const params = useLocalSearchParams();
    const date = (params.date as string) || undefined;
    const [open, setOpen] = useState(false);

    const projects = useMemo(() => {
        if (params.projects) {
            try {
                return JSON.parse(decodeURIComponent(String(params.projects)));
            } catch { }
        }
        return [
            { id: "1", name: "Project Alpha", deadline: "2025-11-16", color: "#1b18b6", progress: 30 },
            { id: "2", name: "Project Beta", deadline: "2025-11-18", color: "#2962FF", progress: 50 },
            { id: "3", name: "Project Gamma", deadline: "2025-11-18", color: "#33C1FF", progress: 70 },
            { id: "4", name: "Project Delta", deadline: "2025-11-20", color: "#004f2fff", progress: 20 },
            { id: "5", name: "Project Epsilon", deadline: "2025-11-22", color: "#26A69A", progress: 90 },
            { id: "6", name: "Project Zeta", deadline: "2025-11-25", color: "#00a643ff", progress: 10 },
        ];
    }, [params.projects]);

    const progressPercent = projects.length
        ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
        : 0;

    const inProgress = projects.filter(p => (p.progress || 0) < 100).length;

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        projects.forEach(p => {
            if (!p.deadline) return;
            if (!marks[p.deadline]) marks[p.deadline] = { dots: [] };
            marks[p.deadline].dots.push({ key: p.id?.toString() || Math.random().toString(), color: p.color });
        });
        return marks;
    }, [projects]);

    const { height } = Dimensions.get("window");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
            {/* HEADER */}
            <View style={{ position: "relative" }}>
                <LinearGradient
                    colors={["#2962FF", "#4FC3F7"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.toolbarContainer}
                >
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={[styles.iconButton, { marginRight: 8 }]} onPress={() => setOpen(true)} activeOpacity={0.8}>
                            <Ionicons name="menu" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/project/manager/pages-manager/manager-log-page")} activeOpacity={0.8}>
                            <Ionicons name="arrow-back" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.iconButton} onPress={() => { }} activeOpacity={0.8}>
                        <Ionicons name="refresh" size={18} color="#fff" />
                    </TouchableOpacity>
                </LinearGradient>

                {open && (
                    <>
                        <TouchableOpacity
                            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "transparent", zIndex: 1 }}
                            activeOpacity={1}
                            onPress={() => setOpen(false)}
                        />
                        <BurgerMenu closeMenu={() => setOpen(false)} />
                    </>
                )}

                <LinearGradient colors={["#2962FF", "#4FC3F7"]} start={[0, 0]} end={[1, 0]} style={styles.headerGradient}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerTitleWrap}>
                            <Text style={styles.headerTitle}>Project Calendar</Text>
                            <Text style={styles.headerSubtitle}>Overview & deadlines</Text>
                        </View>
                    </View>
                    <View style={styles.headerKpiRow}>
                        <View style={styles.headerKpi}>
                            <Text style={styles.headerKpiLabel}>Overall</Text>
                            <Text style={styles.headerKpiValue}>{progressPercent}%</Text>
                        </View>
                        <View style={styles.headerKpi}>
                            <Text style={styles.headerKpiLabel}>Projects</Text>
                            <Text style={styles.headerKpiValue}>{projects.length}</Text>
                        </View>
                        <View style={styles.headerKpi}>
                            <Text style={styles.headerKpiLabel}>In Progress</Text>
                            <Text style={styles.headerKpiValue}>{inProgress}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Titlu Calendar */}
                <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 0 }}>
                    <Text style={styles.sectionTitle}>Projects Calendar Deadlines</Text>
                    <LinearGradient
                        colors={["#2962FF", "#4FC3F7"]}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={styles.titleUnderline}
                    />
                </View>

                {/* CALENDAR */}
                <View style={[styles.calendarCard]}>
                    <Calendar
                        current={date}
                        markingType="multi-dot"
                        markedDates={markedDates}
                        dayComponent={(dayProps) => {
                            const { date: d, onPress, state } = dayProps as any;
                            const DAY_WIDTH = 120;
                            const paddingInside = 8;

                            const projectsForDay = projects.filter(p => {
                                const today = new Date(d.dateString);
                                const deadline = new Date(p.deadline);
                                const start = new Date();
                                return today >= start && today <= deadline;
                            });

                            const baseHeight = 40;
                            const projectHeight = 28;
                            const cardHeight = baseHeight + projectsForDay.length * projectHeight + paddingInside * 2;

                            return (
                                <TouchableOpacity onPress={() => onPress && onPress(d)} activeOpacity={0.8} style={{ width: DAY_WIDTH, margin: 2 }}>
                                    <View
                                        style={{
                                            minHeight: cardHeight,
                                            borderRadius: 12,
                                            backgroundColor: state === "disabled" ? "#f6f7fb" : "#fff",
                                            padding: paddingInside,
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 6,
                                            elevation: 4,
                                        }}
                                    >
                                        <View style={{ paddingBottom: 6 }}>
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: state === "today" ? "700" : "600",
                                                    color: state === "disabled" ? "#b8bac8" : "#0f1724",
                                                }}
                                            >
                                                {d.day}
                                            </Text>
                                        </View>

                                        {projectsForDay.map(p => (
                                            <View
                                                key={p.id}
                                                style={{
                                                    marginBottom: 4,
                                                    backgroundColor: p.color,
                                                    borderRadius: 8,
                                                    paddingVertical: 4,
                                                    paddingHorizontal: 6,
                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{p.name}</Text>
                                                <Text style={{ color: "#fff", fontSize: 11 }}>
                                                    {p.progress ? `${p.progress}%` : "0%"}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        style={{ width: "100%", minHeight: 400 }}
                    />
                </View>

                {/* Titlu Proiecte */}
                <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
                    <Text style={styles.sectionTitle}>Projects Details</Text>
                    <LinearGradient
                        colors={["#2962FF", "#4FC3F7"]}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={styles.titleUnderline}
                    />
                </View>

                {/* LISTA DETALIATĂ PROIECTE */}
                {projects.map(p => (
                    <View
                        key={p.id}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 12,
                            padding: 12,
                            backgroundColor: p.color + "20",
                            borderRadius: 14,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f1724" }}>
                                {p.name}
                            </Text>
                            <Text style={{ fontSize: 14, color: "#0f1724", marginTop: 2 }}>
                                Deadline: {p.deadline}
                            </Text>
                        </View>

                        <View style={{ width: 80, height: 12, backgroundColor: "#e0e0e0", borderRadius: 6, overflow: "hidden" }}>
                            <View
                                style={{
                                    width: `${p.progress || 0}%`,
                                    height: "100%",
                                    backgroundColor: p.color,
                                    borderRadius: 6,
                                }}
                            />
                        </View>

                        <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: "600", color: "#0f1724" }}>
                            {p.progress ? `${p.progress}%` : "0%"}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
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
    iconButton: { width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginRight: 8 },
    headerGradient: { paddingTop: 20, paddingBottom: 14, paddingHorizontal: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 12, elevation: 6 },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerTitleWrap: { flex: 1, paddingHorizontal: 12, alignItems: "center" },
    headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800", textAlign: "center" },
    headerSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 4, textAlign: "center" },
    headerKpiRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between", gap: 8 },
    headerKpi: { flex: 1, alignItems: "center" },
    headerKpiLabel: { color: "rgba(255,255,255,0.9)", fontSize: 12 },
    headerKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1b18b6",
        textShadowColor: "rgba(0,0,0,0.1)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 4,
    },

    titleUnderline: {
        height: 4,
        width: 120, // lungimea liniei
        borderRadius: 2,
        marginBottom: 12,
    },


    calendarCard: { backgroundColor: "#fff", borderRadius: 16, marginVertical: 18, marginHorizontal: 6, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 4, elevation: 3, overflow: "hidden" },
});