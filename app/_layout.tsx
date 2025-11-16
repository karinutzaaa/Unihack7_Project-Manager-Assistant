import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Auth0Provider } from "react-native-auth0";
import { authConfig } from "./auth-config";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const role = await AsyncStorage.getItem("loggedIn");
        setLoggedIn(!!role);
      } catch (e) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
    >
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <Slot />
      )}
    </Auth0Provider>
  );
}
