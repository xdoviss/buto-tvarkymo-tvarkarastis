import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
if (!clientId) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google OAuth may not work.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ""}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
