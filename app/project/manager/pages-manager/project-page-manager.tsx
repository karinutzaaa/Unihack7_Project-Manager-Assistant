import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import BurgerMenu from "./burger-menu-manager";

// 🔹 TIPURI PARTAJATE
type Task = {
  id?: string;
  name: string;
  departments: string[];
  color: string;
  deadline: string;
  createdAt: string;
  done?: boolean;
  progress?: number;
  startDate?: string;
  cost?: number;
};

type Project = {
  id: string | number | undefined;
  name: string;
  description: string;
  deadline?: string;
  budget?: number;
};

type Note = {
  id: string;
  text: string;
  date: string;
  checked?: boolean;
};

/* =========================================================
  STATUS CARDS – FĂRĂ ScrollView INTERN
  ========================================================= */
type StatusCardsProps = {
  pastDue: Task[];
  inProgress: Task[];
  done: Task[];
  onAddTask: (task: Task) => void;
  departmentColors: Record<string, string>;
  textColorForBg: (hex: string) => string;
  onMarkDone?: (taskId?: string) => void;
  onEditTask?: (taskId?: string) => void;
};

function StatusCards({
  pastDue,
  inProgress,
  done,
  departmentColors,
  textColorForBg,
  onMarkDone,
  onEditTask,
}: StatusCardsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filteredPastDue, setFilteredPastDue] = useState<Task[]>([]);
  const [filteredInProgress, setFilteredInProgress] = useState<Task[]>([]);
  const [filteredDone, setFilteredDone] = useState<Task[]>([]);

  const [addTaskModal, setAddTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDepartment, setNewTaskDepartment] = useState("");
  const [newTaskProgress, setNewTaskProgress] = useState("0");
  const [newTaskStart, setNewTaskStart] = useState("");
  const [newTaskEnd, setNewTaskEnd] = useState("");
  const [selectingDateField, setSelectingDateField] = useState<"start" | "end" | null>(null);





  useEffect(() => {
    const today = dayjs();

    setFilteredPastDue(
      pastDue.filter((t) => dayjs(t.deadline).isBefore(today) && !t.done)
    );

    setFilteredInProgress(
      inProgress.filter((t) => dayjs(t.deadline).isAfter(today) && !t.done)
    );

    setFilteredDone(done.filter((t) => t.done === true));
  }, [pastDue, inProgress, done]);

  const openOptions = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeOptions = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleMarkDone = () => {
    if (onMarkDone && selectedTask) onMarkDone(selectedTask.id);
    closeOptions();
  };

  const handleEditTask = () => {
    if (onEditTask && selectedTask) onEditTask(selectedTask.id);
    closeOptions();
  };

  const renderList = (items: Task[]) => {
    if (!items || items.length === 0)
      return <Text style={statusStyles.emptyText}>No tasks</Text>;

    return (
      <View style={statusStyles.list}>
        {items.map((task) => {
          const dept = task.departments[0];
          const color = dept ? departmentColors[dept] : "#2962FF";
          const textColor = textColorForBg(color);
          return (
            <TouchableOpacity
              key={task.id ?? task.name}
              onPress={() => openOptions(task)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[`${color}EE`, `${color}AA`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={statusStyles.taskCard}
              >
                <Text
                  style={[statusStyles.taskTitle, { color: textColor }]}
                  numberOfLines={1}
                >
                  {task.name}
                </Text>
                <Text
                  style={[statusStyles.taskDept, { color: textColor }]}
                  numberOfLines={1}
                >
                  {dept}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      {/* CARD CU GRADIENT */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={statusStyles.headerGradient}
      >
        <Text style={statusStyles.headerTitle}>Task Overview</Text>
        <Text style={statusStyles.headerSubtitle}>
          Track deadlines, progress, and completed tasks.
        </Text>
      </LinearGradient>

      <View style={statusStyles.row}>
        {/* PAST DUE */}
        <View style={[statusStyles.col]}>
          <Text style={[statusStyles.colTitle, { color: "#E53935" }]}>
            🔴 Past Due
          </Text>
          {renderList(filteredPastDue)}
        </View>

        {/* IN PROGRESS */}
        <View style={[statusStyles.col]}>
          <Text style={[statusStyles.colTitle, { color: "#2962FF" }]}>
            🔵 In Progress
          </Text>
          {renderList(filteredInProgress)}
        </View>

        {/* DONE */}
        <View style={[statusStyles.col]}>
          <Text style={[statusStyles.colTitle, { color: "#00A86B" }]}>
            ✅ Done
          </Text>
          {renderList(filteredDone)}
        </View>
      </View>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeOptions}
      >
        <View style={statusStyles.modalOverlay}>
          <View style={statusStyles.modalBox}>
            <Text style={statusStyles.modalTitle}>{selectedTask?.name}</Text>

            <TouchableOpacity
              style={[statusStyles.modalButton, statusStyles.markDone]}
              onPress={handleMarkDone}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={statusStyles.modalButtonText}>Mark as Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[statusStyles.modalButton, statusStyles.editTask]}
              onPress={handleEditTask}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={statusStyles.modalButtonText}>Edit Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[statusStyles.modalButton, statusStyles.cancel]}
              onPress={closeOptions}
            >
              <Ionicons name="close-outline" size={20} color="#1E293B" />
              <Text
                style={[statusStyles.modalButtonText, { color: "#1E293B" }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* =========================================================
  OVERVIEW NOTES – FĂRĂ ScrollView INTERN
  ========================================================= */
type OverviewProps = {
  project: Project;
  tasks: Task[];
  notes: Note[];
  onAddNote: (note: Note) => void;
  onEditNote: (noteId: string, newText: string) => void;
  onToggleNoteChecked: (noteId: string) => void;
  onAnalyticsPress: () => void;
  onOpenTaskSheet: () => void;
};

function OverviewNotesComponent({
  project,
  tasks,
  notes,
  onAddNote,
  onEditNote,
  onToggleNoteChecked,
  onAnalyticsPress,
  onOpenTaskSheet,
}: OverviewProps) {
  const [noteModal, setNoteModal] = useState(false);
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [noteBeingEdited, setNoteBeingEdited] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [newNote, setNewNote] = useState("");

  const overallProgress = tasks.length
    ? Math.round(
      tasks.reduce((a, t) => a + (t.progress ?? 0), 0) / tasks.length
    )
    : 0;

  const totalBudget = project?.budget ?? 0;
  const spent = tasks.reduce((a, t) => a + (t.cost ?? 0), 0);
  const remaining = Math.max(0, totalBudget - spent);

  return (
    <View style={overviewStyles.container}>
      {/* PROJECT STATS */}
      <View style={overviewStyles.card}>
        <View style={overviewStyles.cardHeader}>
          <Text style={overviewStyles.cardTitle}>📊 Overview</Text>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#3b82f6"
          />
        </View>

        <View style={overviewStyles.statsRow}>
          <View style={overviewStyles.statItem}>
            <Ionicons name="calendar-outline" size={22} color="#6366f1" />
            <Text style={overviewStyles.statText}>
              {project.deadline ?? "No deadline"}
            </Text>
          </View>
          <View style={overviewStyles.statItem}>
            <Ionicons name="cash-outline" size={22} color="#16a34a" />
            <Text style={overviewStyles.statText}>{remaining} € left</Text>
          </View>
          <View style={overviewStyles.statItem}>
            <Ionicons name="bar-chart-outline" size={22} color="#0ea5e9" />
            <Text style={overviewStyles.statText}>{overallProgress}%</Text>
          </View>
        </View>

        <View style={overviewStyles.progressContainer}>
          <View style={overviewStyles.progressBarBackground}>
            <Animated.View
              style={[
                overviewStyles.progressBarFill,
                { width: `${overallProgress}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={overviewStyles.card}>
        <TouchableOpacity
          style={[overviewStyles.actionButton, { backgroundColor: "#3b82f6" }]}
          onPress={onAnalyticsPress}
        >
          <Ionicons name="stats-chart" size={20} color="#fff" />
          <Text style={overviewStyles.actionText}>View Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[overviewStyles.actionButton, { backgroundColor: "#10b981" }]}
          onPress={onOpenTaskSheet}
        >
          <Ionicons name="briefcase-outline" size={20} color="#fff" />
          <Text style={overviewStyles.actionText}>Manage Tasks</Text>
        </TouchableOpacity>
      </View>

      {/* TASKS */}
      <View style={overviewStyles.card}>
        <View style={overviewStyles.cardHeader}>
          <Text style={overviewStyles.cardTitle}>📝 Tasks</Text>

          <TouchableOpacity onPress={onOpenTaskSheet}>
            <Ionicons name="add-circle" size={28} color="#2962FF" />
          </TouchableOpacity>
        </View>

        {tasks.length === 0 ? (
          <Text style={overviewStyles.emptyText}>No tasks yet.</Text>
        ) : (
          tasks.map((t) => (
            <View key={t.id ?? t.name} style={overviewStyles.taskItem}>
              <Ionicons
                name={t.done ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={t.done ? "#10b981" : "#cbd5e1"}
              />
              <Text
                style={[
                  overviewStyles.taskText,
                  t.done && overviewStyles.taskDone,
                ]}
              >
                {t.name}
              </Text>
            </View>
          ))
        )}
      </View>


      {/* NOTES */}
      <View style={[overviewStyles.card, { marginBottom: 0 }]}>
        <View style={overviewStyles.cardHeader}>
          <Text style={overviewStyles.cardTitle}>🗒️ Notes</Text>
          <TouchableOpacity onPress={() => setNoteModal(true)}>
            <Ionicons name="add-circle" size={28} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {notes.slice(0, 5).map((n) => (
          <View key={n.id} style={overviewStyles.noteItem}>
            <View style={overviewStyles.noteRow}>
              <Text
                style={[
                  overviewStyles.noteText,
                  n.checked && overviewStyles.noteChecked,
                ]}
              >
                {n.text}
              </Text>
              <View style={overviewStyles.noteActions}>
                <TouchableOpacity
                  onPress={() => {
                    setNoteBeingEdited(n);
                    setEditNoteModal(true);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onToggleNoteChecked(n.id)}>
                  <Ionicons
                    name={n.checked ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={n.checked ? "#10b981" : "#cbd5e1"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={overviewStyles.noteDate}>{n.date}</Text>
          </View>
        ))}

      </View>


      {/* NOTE MODAL */}
      <Modal
        visible={noteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModal(false)}
      >
        <View style={overviewStyles.modalOverlay}>
          <View style={overviewStyles.modalContent}>
            <Text style={overviewStyles.modalTitle}>Add Note</Text>
            <TextInput
              placeholder="Write a note..."
              style={overviewStyles.modalInput}
              multiline
              value={newNote}
              onChangeText={setNewNote}
            />
            <View style={overviewStyles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setNewNote("");
                  setNoteModal(false);
                }}
              >
                <Text style={overviewStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!newNote.trim()) return setNoteModal(false);
                  const note: Note = {
                    id: `${Date.now()}`,
                    text: newNote.trim(),
                    date: new Date().toISOString().split("T")[0],
                  };
                  onAddNote(note);
                  setNewNote("");
                  setNoteModal(false);
                }}
              >
                <Text style={overviewStyles.saveText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT NOTE MODAL */}
      <Modal
        visible={editNoteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditNoteModal(false)}
      >
        <View style={overviewStyles.modalOverlay}>
          <View style={overviewStyles.modalContent}>
            <Text style={overviewStyles.modalTitle}>Edit Note</Text>
            <TextInput
              style={overviewStyles.modalInput}
              multiline
              value={noteBeingEdited?.text || ""}
              onChangeText={(text) =>
                setNoteBeingEdited((prev) => (prev ? { ...prev, text } : null))
              }
            />
            <View style={overviewStyles.modalActions}>
              <TouchableOpacity onPress={() => setEditNoteModal(false)}>
                <Text style={overviewStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (noteBeingEdited) {
                    onEditNote(noteBeingEdited.id, noteBeingEdited.text);
                    setEditNoteModal(false);
                  }
                }}
              >
                <Text style={overviewStyles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* =========================================================
  PAGINA PRINCIPALĂ
  ========================================================= */

export default function ProjectPageManager(): React.ReactElement {
  const params = useLocalSearchParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [project, setProject] = useState<Project>({
    id,
    name: `Project ${id}`,
    description: "Engineering and manufacturing timeline.",
  });

  // ADD TASK MODAL STATE — trebuie să fie în ProjectPageManager!
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDepartment, setNewTaskDepartment] = useState("");
  const [newTaskProgress, setNewTaskProgress] = useState("0");
  const [newTaskStart, setNewTaskStart] = useState("");
  const [newTaskEnd, setNewTaskEnd] = useState("");
  const [selectingDateField, setSelectingDateField] =
    useState<"start" | "end" | null>(null);




  const departmentColors: Record<string, string> = {
    "Design Mecanic": "#ff16d4ff",
    "Design Electric": "#33C1FF",
    "Purchasing": "#004f2fff",
    "Tooling Shop": "#17e100ff",
    "Assamblare Mecanica": "#ff3333ff",
    "Assamblare Electrica": "#FF8F33",
    "Assamblare Finala": "#8F33FF",
    "Software Offline": "#008c85ff",
    "Software Debug": "#00a643ff",
    Teste: "#3a33ffff",
    Livrare: "#d454ffff",
  };

  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    if (tasks.length > 0) return;

    const dummy: Task[] = [
      // IN PROGRESS — deadline în viitor, done = false
      {
        id: "t1",
        name: "Design structura robot",
        departments: ["Design Mecanic"],
        color: departmentColors["Design Mecanic"],
        progress: 20,
        startDate: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
        deadline: dayjs().add(4, "day").format("YYYY-MM-DD"),
        done: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "t2",
        name: "Schema electrică finală",
        departments: ["Design Electric"],
        color: departmentColors["Design Electric"],
        progress: 40,
        startDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
        deadline: dayjs().add(9, "day").format("YYYY-MM-DD"),
        done: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "t3",
        name: "Test platformă software",
        departments: ["Software Debug"],
        color: departmentColors["Software Debug"],
        progress: 60,
        startDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        deadline: dayjs().add(8, "day").format("YYYY-MM-DD"),
        done: false,
        createdAt: new Date().toISOString(),
      },

      // PAST DUE — deadline trecut, done = false
      {
        id: "t4",
        name: "Analiză componente",
        departments: ["Purchasing"],
        color: departmentColors["Purchasing"],
        progress: 75,
        startDate: dayjs().subtract(12, "day").format("YYYY-MM-DD"),
        deadline: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
        done: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "t5",
        name: "Asamblare subansamble",
        departments: ["Assamblare Mecanica"],
        color: departmentColors["Assamblare Mecanica"],
        progress: 30,
        startDate: dayjs().subtract(10, "day").format("YYYY-MM-DD"),
        deadline: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        done: false,
        createdAt: new Date().toISOString(),
      },

      // DONE — completate deja
      {
        id: "t6",
        name: "Test inițial livrare",
        departments: ["Livrare"],
        color: departmentColors["Livrare"],
        progress: 100,
        startDate: dayjs().subtract(8, "day").format("YYYY-MM-DD"),
        deadline: dayjs().subtract(4, "day").format("YYYY-MM-DD"),
        done: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "t7",
        name: "Simulare software",
        departments: ["Software Offline"],
        color: departmentColors["Software Offline"],
        progress: 100,
        startDate: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        deadline: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
        done: true,
        createdAt: new Date().toISOString(),
      },

      // Extra taskuri pentru calendar (viitor + progres mic)
      {
        id: "t8",
        name: "Test echipamente",
        departments: ["Teste"],
        color: departmentColors["Teste"],
        progress: 5,
        startDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
        deadline: dayjs().add(10, "day").format("YYYY-MM-DD"),
        done: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "t9",
        name: "Asamblare finală",
        departments: ["Assamblare Finala"],
        color: departmentColors["Assamblare Finala"],
        progress: 0,
        startDate: dayjs().add(5, "day").format("YYYY-MM-DD"),
        deadline: dayjs().add(15, "day").format("YYYY-MM-DD"),
        done: false,
        createdAt: new Date().toISOString(),
      },
    ];

    setTasks(dummy);
  }, []);


  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);

  // 🔹 ADD DUMMY NOTES HERE
  useEffect(() => {
    if (notes.length > 0) return;

    const dummyNotes: Note[] = [
      {
        id: "n1",
        text: "Verifică ultimele revizii de la mecanic.",
        date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
        checked: false,
      },
      {
        id: "n2",
        text: "Întreabă echipa electrică de cablajul final.",
        date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        checked: false,
      },
      {
        id: "n3",
        text: "Actualizează costurile pentru achiziții.",
        date: dayjs().format("YYYY-MM-DD"),
        checked: true,
      },
      {
        id: "n4",
        text: "Planifică sesiunea software pentru etapa următoare.",
        date: dayjs().format("YYYY-MM-DD"),
        checked: false,
      },
      {
        id: "n5",
        text: "Adaugă feedback-ul de la testul preliminar.",
        date: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
        checked: false,
      },
    ];

    setNotes(dummyNotes);
  }, []);


  const today = dayjs();

  useEffect(() => {
    const finalId = id ?? "1";

    fetch(`http://localhost:5196/api/Projects/${finalId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        setProject({
          id: data.id,
          name: data.name,
          description: data.description,
          deadline: data.deadline,
          budget: data.budget,
        });
      })
      .catch((err) => {
        console.error("Eroare API Projects:", err);
      });
  }, [id]);

  function textColorForBg(hex: string) {
    try {
      const h = (hex || "#000").replace("#", "").slice(0, 6);
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.65 ? "#000" : "#fff";
    } catch {
      return "#fff";
    }
  }

  function toggleNoteChecked(noteId: string) {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === noteId ? { ...n, checked: !n.checked } : n
      );
      return [
        ...updated.filter((n) => !n.checked),
        ...updated.filter((n) => n.checked),
      ];
    });
  }

  const inProgress = tasks.filter(
    (t) => dayjs(t.deadline).isAfter(today) && !t.done
  );
  const pastDue = tasks.filter(
    (t) => dayjs(t.deadline).isBefore(today) && !t.done
  );
  const done = tasks.filter((t) => t.done);

  return (
    <SafeAreaView style={styles.container}>
      {/* UNICUL ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ position: "relative" }}>
          {/* HEADER TOOLBAR */}
          <LinearGradient
            colors={["#2962FF", "#4FC3F7"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.toolbarContainer}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.iconButton, { marginRight: 8 }]}
                onPress={() => setOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="menu" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  router.push(
                    "/project/manager/pages-manager/manager-log-page"
                  )
                }
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => { }}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={18} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          {/* OVERLAY PENTRU MENIU */}
          {open && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "transparent",
                zIndex: 1,
              }}
              activeOpacity={1}
              onPress={() => setOpen(false)}
            />
          )}

          {open && <BurgerMenu closeMenu={() => setOpen(false)} />}

          {/* HEADER GRADIENT */}
          <LinearGradient
            colors={["#2962FF", "#4FC3F7"]}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.headerGradient}
          >
            <View style={styles.headerRow}>
              <View style={styles.headerTitleWrap}>
                <Text style={styles.headerTitle}>{project.name}</Text>
                <Text style={styles.headerSubtitle}>
                  {project.description}
                </Text>
              </View>
            </View>

            <View style={styles.headerKpiRow}>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiLabel}>Total Tasks</Text>
                <Text style={styles.headerKpiValue}>{tasks.length}</Text>
              </View>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiLabel}>In Progress</Text>
                <Text style={styles.headerKpiValue}>{inProgress.length}</Text>
              </View>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiLabel}>Completed</Text>
                <Text style={styles.headerKpiValue}>{done.length}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* OVERVIEW NOTES */}
          <OverviewNotesComponent
            project={project}
            tasks={tasks}
            notes={notes}
            onAddNote={(note) => setNotes((prev) => [note, ...prev])}
            onEditNote={(noteId, newText) =>
              setNotes((prev) =>
                prev.map((n) =>
                  n.id === noteId ? { ...n, text: newText } : n
                )
              )
            }
            onToggleNoteChecked={toggleNoteChecked}
            onAnalyticsPress={() =>
              router.push("/project/manager/pages-manager/analytics-page")
            }
            onOpenTaskSheet={() =>
              router.push(
                "/project/manager/pages-manager/microsoft-assistant-page"
              )
            }
          />

          {/* CALENDAR SECTION */}
          <View style={styles.section}>
            <View style={{ marginHorizontal: 4, marginBottom: 8 }}>
              <Text style={styles.sectionTitle}>Project Timeline</Text>
            </View>

            <View style={styles.calendarCard}>
              <Calendar
                markingType="multi-dot"
                markedDates={{}}
                dayComponent={(props: any) => {
                  const { date: d, state, onPress } = props;
                  const DAY_WIDTH = 120;
                  const paddingInside = 8;

                  const dayTasks = tasks.filter((task) => {
                    if (!task.startDate || !task.deadline) return false;
                    const start = new Date(task.startDate);
                    const end = new Date(task.deadline);
                    const today = new Date(d.dateString);
                    return today >= start && today <= end;
                  });

                  const baseHeight = 40;
                  const taskHeight = 30;
                  const cardHeight =
                    baseHeight + dayTasks.length * taskHeight + paddingInside * 2;

                  return (
                    <TouchableOpacity
                      onPress={() => onPress && onPress(d)}
                      activeOpacity={0.85}
                      style={{ width: DAY_WIDTH, margin: 2 }}
                    >
                      <View
                        style={{
                          minHeight: cardHeight,
                          borderRadius: 14,
                          backgroundColor:
                            state === "disabled" ? "#f6f7fb" : "#fff",
                          padding: paddingInside,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 6,
                          elevation: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: state === "today" ? "800" : "600",
                            color:
                              state === "disabled" ? "#b8bac8" : "#0f1724",
                            paddingBottom: 6,
                          }}
                        >
                          {d.day}
                        </Text>

                        {dayTasks.map((task) => {
                          const dept = task.departments?.[0] ?? "General";
                          const color =
                            departmentColors[dept] || task.color || "#2962FF";

                          return (
                            <View
                              key={task.id}
                              style={{
                                marginBottom: 4,
                                backgroundColor: color,
                                borderRadius: 8,
                                paddingVertical: 5,
                                paddingHorizontal: 6,
                              }}
                            >
                              <Text
                                style={{
                                  color: textColorForBg(color),
                                  fontWeight: "700",
                                  fontSize: 13,
                                }}
                              >
                                {task.name}
                              </Text>

                              <Text
                                style={{
                                  color: textColorForBg(color),
                                  fontSize: 11,
                                  opacity: 0.85,
                                }}
                              >
                                {task.progress
                                  ? `${task.progress}%`
                                  : "0%"}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                style={{ width: "100%", minHeight: 400 }}
              />
            </View>
          </View>

          {/* STATUS CARDS */}
          <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
            <StatusCards
              pastDue={pastDue}
              inProgress={inProgress}
              done={done}
              departmentColors={departmentColors}
              textColorForBg={textColorForBg}
              onMarkDone={(taskId) =>
                setTasks((prev) =>
                  prev.map((t) => (t.id === taskId ? { ...t, done: true } : t))
                )
              }
              onEditTask={(taskId) => console.log(taskId)}

              // 🔥 aici vine partea nouă
              onAddTask={(task) => setTasks(prev => [...prev, task])}
            />

          </View>
        </View>
      </ScrollView>

      {/* ADD TASK MODAL */}
      <Modal
        visible={addTaskModal}
        transparent
        animationType="slide"
        onRequestClose={() => setAddTaskModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 20
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20
          }}>

            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
              Add Task
            </Text>

            {/* NAME */}
            <TextInput
              placeholder="Task name"
              value={newTaskName}
              onChangeText={setNewTaskName}
              style={{
                borderWidth: 1,
                borderColor: "#cbd5e1",
                borderRadius: 12,
                padding: 10,
                marginBottom: 10
              }}
            />

            {/* DEPARTMENT */}
            <Text style={{ marginBottom: 6, fontWeight: "600" }}>Department</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {Object.keys(departmentColors).map(dep => (
                <TouchableOpacity
                  key={dep}
                  onPress={() => setNewTaskDepartment(dep)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor:
                      newTaskDepartment === dep ? departmentColors[dep] : "#f1f5f9"
                  }}
                >
                  <Text style={{
                    color: newTaskDepartment === dep ? "#fff" : "#000",
                    fontWeight: "600"
                  }}>
                    {dep}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* PROGRESS */}
            <TextInput
              placeholder="Progress %"
              keyboardType="numeric"
              value={newTaskProgress}
              onChangeText={setNewTaskProgress}
              style={{
                borderWidth: 1,
                borderColor: "#cbd5e1",
                borderRadius: 12,
                padding: 10,
                marginBottom: 10
              }}
            />

            {/* DATES */}
            <TouchableOpacity
              onPress={() => setSelectingDateField("start")}
              style={{
                borderWidth: 1,
                borderColor: "#cbd5e1",
                borderRadius: 12,
                padding: 12,
                marginBottom: 10
              }}
            >
              <Text>{newTaskStart ? `Start: ${newTaskStart}` : "Select start date"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectingDateField("end")}
              style={{
                borderWidth: 1,
                borderColor: "#cbd5e1",
                borderRadius: 12,
                padding: 12,
                marginBottom: 10
              }}
            >
              <Text>{newTaskEnd ? `End: ${newTaskEnd}` : "Select end date"}</Text>
            </TouchableOpacity>

            {/* CALENDAR PICKER */}
            {selectingDateField && (
              <Calendar
                onDayPress={(day) => {
                  if (selectingDateField === "start") setNewTaskStart(day.dateString);
                  if (selectingDateField === "end") setNewTaskEnd(day.dateString);
                  setSelectingDateField(null);
                }}
                style={{ marginBottom: 10 }}
              />
            )}

            {/* ACTION BUTTONS */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10
            }}>
              <TouchableOpacity onPress={() => setAddTaskModal(false)}>
                <Text style={{ color: "#ef4444", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onAddTask({
                    id: Date.now().toString(),
                    name: newTaskName,
                    departments: [newTaskDepartment],
                    progress: Number(newTaskProgress),
                    startDate: newTaskStart,
                    deadline: newTaskEnd,
                    color: departmentColors[newTaskDepartment],
                    createdAt: new Date().toISOString(),
                    done: false,
                  });
                }}
                style={{
                  backgroundColor: "#2962FF",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Save Task</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* =========================================================
  STILURI – PAGINĂ
  ========================================================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  scrollContainer: { paddingBottom: 120, paddingHorizontal: 14 },

  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
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

  headerGradient: {
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitleWrap: { flex: 1, paddingHorizontal: 12, alignItems: "center" },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  headerKpiRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
    gap: 8,
  },
  headerKpi: { flex: 1, alignItems: "center" },
  headerKpiLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
  },
  headerKpiValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },

  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginVertical: 18,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
});

/* =========================================================
  STILURI – OVERVIEW
  ========================================================= */

const overviewStyles = StyleSheet.create({
  container: { paddingVertical: 20 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },
  cardTitle: { fontWeight: "700", fontSize: 18, color: "#1e293b" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  statItem: { alignItems: "center" },
  statText: { fontSize: 14, color: "#334155", marginTop: 4 },
  progressContainer: { marginTop: 10 },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  actionText: { color: "#fff", fontWeight: "600", marginLeft: 8 },
  emptyText: { color: "#94a3b8", textAlign: "center", marginTop: 10 },
  taskItem: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  taskText: { marginLeft: 10, color: "#1e293b" },
  taskDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  noteItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  noteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteText: { color: "#1e293b", flex: 1, marginRight: 10 },
  noteChecked: { textDecorationLine: "line-through", color: "#9ca3af" },
  noteDate: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  noteActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 20,
  },
  cancelText: { color: "#ef4444", fontWeight: "600" },
  saveText: { color: "#3b82f6", fontWeight: "600" },
});

/* =========================================================
  STILURI – STATUS CARDS
  ========================================================= */

const statusStyles = StyleSheet.create({
  headerGradient: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  col: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    minHeight: 250,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  colTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  list: {
    marginTop: 4,
  },
  taskCard: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  taskTitle: { fontSize: 15, fontWeight: "700" },
  taskDept: { fontSize: 13, opacity: 0.9, marginTop: 3 },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    fontStyle: "italic",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 18,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  markDone: { backgroundColor: "#00A86B" },
  editTask: { backgroundColor: "#2962FF" },
  cancel: { backgroundColor: "#E2E8F0" },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
