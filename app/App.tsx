import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { LinearGradient } from "expo-linear-gradient";
import { jwtDecode } from "jwt-decode";

// ---------- MAIN APP CONTENT ----------
function AppContent() {
  const { getCredentials, authorize } = useAuth0();
  const router = useRouter();
  const [credentials, setCredentials] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);

  // Check credentials on focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCreds = async () => {
        try {
          const cr = await getCredentials();
          if (!isActive) return;

          if (cr?.idToken) {
            setCredentials(cr);
            const decoded = jwtDecode<any>(cr.idToken);
            const roles = decoded["https://myapp.example.com/roles"] || [];

            // redirect immediately
            if (roles.includes("manager")) router.replace("/project/manager/pages-manager/manager-log-page");
            else if (roles.includes("boss")) router.replace("/project/boss/pages-boss/boss-log-page");
            else if (roles.includes("worker")) router.replace("/project/worker/pages-worker/worker-log-page");
            else Alert.alert("Unknown role!", JSON.stringify(roles));
          }
        } catch (err) {
          console.log("Error fetching credentials", err);
        } finally {
          if (isActive) setCheckingAuth(false);
        }
      };

      fetchCreds();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const onLogin = async () => {
    setLoading(true);
    try {
      await authorize({ scope: "openid profile email" });
      // redirect handled automatically
    } catch (err: any) {
      Alert.alert("Login failed", err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2962FF" />
      </View>
    );
  }

  if (!credentials) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={["#E4ECFF", "#F3F6FB"]}
          start={[0, 0]}
          end={[1, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.blobBlue} />
        <View style={styles.blobCyan} />

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient colors={["#2962FF", "#33C1FF"]} style={styles.logoCircle}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/9068/9068649.png" }}
                style={styles.logoIcon}
              />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Project Assistant</Text>
          <Text style={styles.subtitle}>Gestionare simplă. Decizii rapide.</Text>
        </View>

        <View>
          <TouchableOpacity onPress={onLogin} style={styles.button} disabled={loading}>
            <LinearGradient colors={["#1b18b6", "#2962FF"]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{loading ? "Se încarcă..." : "Login"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // user is logged in — redirect happens automatically
  return null;
}

// ---------- PROVIDER WRAPPER ----------
export default function App() {
  return (
    <Auth0Provider
      domain="dev-mibqkoncvn7n5etf.us.auth0.com"
      clientId="MoLqMkST9IldYmREu7dTAwO3HdQRdWJD"
      // NO redirectUri prop here
    >
      <AppContent />
    </Auth0Provider>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 28 },
  blobBlue: { position: "absolute", width: 260, height: 260, backgroundColor: "#2962FF33", borderRadius: 200, top: -40, left: -60 },
  blobCyan: { position: "absolute", width: 260, height: 260, backgroundColor: "#33C1FF33", borderRadius: 200, bottom: -50, right: -40 },
  header: { alignItems: "center", marginBottom: 40 },
  logoContainer: { marginBottom: 16 },
  logoCircle: { width: 95, height: 95, borderRadius: 50, justifyContent: "center", alignItems: "center", elevation: 5 },
  logoIcon: { width: 54, height: 54, tintColor: "#fff" },
  title: { fontSize: 28, fontWeight: "800", color: "#1E293B" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 3 },
  button: { width: "100%", borderRadius: 14, overflow: "hidden", marginTop: 4 },
  buttonGradient: { paddingVertical: 12, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
