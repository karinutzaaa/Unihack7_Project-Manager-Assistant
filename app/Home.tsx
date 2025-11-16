import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Alert, Button, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Home() {
  const router = useRouter();
  const { authorize, clearSession, user, getCredentials, error, isLoading } = useAuth0();

  const onLogin = async () => {
    try {
      await authorize({}, {});
      const credentials = await getCredentials();

      if (!credentials?.idToken) {
        Alert.alert("Nu există ID Token!");
        return;
      }

      const decoded: any = jwtDecode(credentials.idToken);

      // IMPORTANT: trebuie să fie același namespace ca în Auth0 Action!
      const roles = decoded["https://myapp.example.com/roles"] || [];

      console.log("User roles:", roles);

      // 🔥 Redirect în funcție de rol:
      if (roles.includes("manager")) {
        router.replace("/project/manager/pages-manager/manager-log-page");
      } 
      else if (roles.includes("boss")) {
        router.replace("/project/boss/pages-boss/boss-log-page");
      } 
      else if (roles.includes("worker")) {
        router.replace("/project/worker/pages-worker/worker-log-page");
      }
      else {
        Alert.alert("Rol necunoscut!", JSON.stringify(roles));
      }

    } catch (e) {
      console.log(e);
      //Alert.alert("Login Error", e?.message || "Unknown error");
    }
  };

  const onLogout = async () => {
    try {
      await clearSession({}, {});
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  const loggedIn = !!user;

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Auth0 Login</Text>

      {user && <Text>You are logged in as {user.name}</Text>}
      {!user && <Text>You are not logged in</Text>}

      <Button
        title={loggedIn ? "Log Out" : "Log In"}
        onPress={loggedIn ? onLogout : onLogin}
      />

      {error && <Text style={{ color: "red" }}>{error.message}</Text>}
    </View>
  );
}
