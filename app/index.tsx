import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Cheia principală pentru stocarea datelor
const STORAGE_KEY = "APP_DATA";

<<<<<<< Updated upstream
  const handleLogin = () => {
    if (username === "" && password === "") {
      router.replace("../../project/manager/pages-manager/manager-log-page"); // navighează la Manager
    } else if (username === "boss" && password === "boss") {
      router.replace("../../project/boss/pages-boss/boss-log-page"); // navighează la Șef Departament
    }
    else if (username === "worker" && password === "worker") {
      router.replace("../../project/worker/pages-worker/worker-log-page"); // navighează la Șef Departament
    } else {
=======
// Funcții pentru AsyncStorage
const initData = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initialData = {
      users: [
        { username: "manager", password: "manager", role: "manager" },
        { username: "departmentMec", password: "departmentMec", role: "bossDesignMecanic" },
        { username: "worker", password: "worker", role: "workerDesignMecanic" },
      ],
      projects: [],
      tasks: [],
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const getData = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : await initData();
};

export default function Index() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Opțional: inițializează storage la mount
  useEffect(() => {
    initData();
  }, []);

  const handleLogin = async () => {
    const data = await getData();
    const user = data.users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (!user) {
>>>>>>> Stashed changes
      alert("Username sau parola greșită!");
      return;
    }

    // Navigare în funcție de rol
    if (user.role === "manager") {
      router.replace("./manager");
    } else if (user.role.includes("bossDesignMecanic")) {
      router.replace("./DepBoss");
    } else if (user.role.includes("worker")) {
      router.replace("./WorkerPage");
    } else {
      alert("Rol necunoscut!");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://t4.ftcdn.net/jpg/04/43/86/95/360_F_443869511_jd2jaCumkg72bbZnHgP6kquAsU1huenY.jpg" }}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Project Assistant</Text>
          <Text style={styles.subtitle}>Conectează-te pentru a continua</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Parolă"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    fontSize: 16,
    color: "#111827",
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
