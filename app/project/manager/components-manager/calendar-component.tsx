import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";

type Task = {
  id?: string;
  name: string;
  startDate?: string;
  deadline?: string;
  color?: string;
  departments?: string[];
  progress?: number;
};

type Props = {
  tasks: Task[];
  departmentColors: Record<string, string>;
  textColorForBg: (hex: string) => string;
  styles: any;
  onTaskAdded?: (task: Task) => void; // ✅ PROPS DEFINIT CORECT
};

export default function CalendarComponent({
  tasks: initialTasks = [],
  departmentColors,
  textColorForBg,
  styles,
  onTaskAdded, // ✅ SCOS DIN PROPS
}: Props) {
  const today = dayjs();
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? []);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState<"start" | "deadline" | null>(null);
  const [warning, setWarning] = useState("");
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    departments: [] as string[],
    color: "",
    startDate: "",
    deadline: "",
    progress: 0,
  });

  const addTask = () => {
    if (!taskData.name) return setWarning("Please enter a task name.");
    if (!taskData.startDate) return setWarning("Please select a start date.");
    if (!taskData.deadline) return setWarning("Please select a deadline.");
    if (taskData.departments.length === 0)
      return setWarning("Please select at least one department.");

    const firstDept = taskData.departments[0];
    const deptColor = departmentColors[firstDept] ?? "#1b18b6";

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: taskData.name,
      description: taskData.description,
      departments: taskData.departments,
      color: deptColor,
      startDate: taskData.startDate,
      deadline: taskData.deadline,
      progress: taskData.progress,
    };

    // ✅ adaugă task în lista locală
    setTasks((prev) => [...prev, newTask]);

    // ✅ trimite task-ul în parent dacă există un callback
    onTaskAdded?.(newTask);

    // reset modal
    setTaskData({
      name: "",
      description: "",
      departments: [],
      color: "",
      startDate: "",
      deadline: "",
      progress: 0,
    });
    setShowModal(false);
    setShowCalendar(null);
    setWarning("");

    Alert.alert("Task added!", `${newTask.name} - ${firstDept}`);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
      <Calendar
        style={{ borderRadius: 16, marginBottom: 20, height: 450 }}
        markingType="multi-dot"
        dayComponent={({ date, state }) => {
          if (!date) return null;
          const d = dayjs(date.dateString);
          const isToday = d.isSame(today, "day");

          const dayTasks = tasks.filter((task) => {
            if (!task.startDate || !task.deadline) return false;
            const start = dayjs(task.startDate);
            const end = dayjs(task.deadline);
            return d.isAfter(start.subtract(1, "day")) && d.isBefore(end.add(1, "day"));
          });

          return (
            <View
              style={{
                padding: 12,
                borderRadius: 16,
                backgroundColor: "#fff",
                alignItems: "center",
                minHeight: 120,
                width: 90,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: isToday ? "800" : "600",
                  color: isToday ? "#4FC3F7" : "#1b18b6",
                }}
              >
                {date.day}
              </Text>

              {dayTasks.slice(0, 3).map((task) => {
                const dept = task.departments?.[0] ?? "General";
                const color = departmentColors[dept] ?? task.color ?? "#6366F1";
                return (
                  <View
                    key={task.id}
                    style={{
                      marginTop: 5,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: color,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: textColorForBg(color),
                      }}
                    >
                      {task.name}
                    </Text>
                  </View>
                );
              })}
              {dayTasks.length > 3 && (
                <Text style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                  +{dayTasks.length - 3}
                </Text>
              )}
            </View>
          );
        }}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#1b18b6",
          monthTextColor: "#1b18b6",
          arrowColor: "#1b18b6",
          todayTextColor: "#fff",
          textDayFontSize: 18,
          textDayFontWeight: "700",
        }}
        firstDay={1}
        enableSwipeMonths
      />
    </ScrollView>
  );
}
