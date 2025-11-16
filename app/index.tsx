import React from "react";
import { Auth0Provider } from "react-native-auth0";
import App from "./App";
import { authConfig } from "./auth-config";

export default function Index() {

  return (
    <Auth0Provider domain={authConfig.domain} clientId={authConfig.clientId}>
        <App />
    </Auth0Provider>
  );
}
