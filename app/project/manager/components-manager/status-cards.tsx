import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

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

type StatusCardsProps = {
  pastDue: Task[];
  inProgress: Task[];
  done: Task[];
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


  const filteredPastDue = pastDue;
  const filteredInProgress = inProgress;
  const filteredDone = done;


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
      return <Text style={styles.emptyText}>No tasks</Text>;

    return (
      <View style={styles.list}>
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
                style={styles.taskCard}
              >
                <Text style={[styles.taskTitle, { color: textColor }]}>
                  {task.name}
                </Text>
                <Text style={[styles.taskDept, { color: textColor }]}>
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
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Task Overview</Text>
        <Text style={styles.headerSubtitle}>
          Track deadlines, progress, and completed tasks.
        </Text>
      </LinearGradient>

      <View style={styles.row}>
        <View style={[styles.col]}>
          <Text style={[styles.colTitle, { color: "#E53935" }]}>
            🔴 Past Due
          </Text>
          {renderList(filteredPastDue)}
        </View>

        <View style={[styles.col]}>
          <Text style={[styles.colTitle, { color: "#2962FF" }]}>🔵 In Progress</Text>
          {renderList(filteredInProgress)}
        </View>

        <View style={[styles.col]}>
          <Text style={[styles.colTitle, { color: "#00A86B" }]}>✅ Done</Text>
          {renderList(filteredDone)}
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => setAddTaskModal(true)}
          style={{
            backgroundColor: "#2962FF",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 8 }}>
            Add Task
          </Text>
        </TouchableOpacity>
      </View>


      {/* Options Modal */}
      <Modal
        visible={addTaskModal}
        transparent
        animationType="slide"
        onRequestClose={() => setAddTaskModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
            }}
          >
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
                marginBottom: 10,
              }}
            />

            {/* DEPARTMENT */}
            <Text style={{ marginBottom: 6, fontWeight: "600" }}>Department</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 12,
              }}
            >
              {Object.keys(departmentColors).map((dep) => (
                <TouchableOpacity
                  key={dep}
                  onPress={() => setNewTaskDepartment(dep)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor:
                      newTaskDepartment === dep ? departmentColors[dep] : "#f1f5f9",
                  }}
                >
                  <Text
                    style={{
                      color: newTaskDepartment === dep ? "#fff" : "#000",
                      fontWeight: "600",
                    }}
                  >
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
                marginBottom: 10,
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
                marginBottom: 10,
              }}
            >
              <Text>
                {newTaskStart ? `Start: ${newTaskStart}` : "Select start date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectingDateField("end")}
              style={{
                borderWidth: 1,
                borderColor: "#cbd5e1",
                borderRadius: 12,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <Text>{newTaskEnd ? `End: ${newTaskEnd}` : "Select end date"}</Text>
            </TouchableOpacity>

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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
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

                  setAddTaskModal(false);
                }}
                style={{
                  backgroundColor: "#2962FF",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerGradient: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
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


export default StatusCards;
