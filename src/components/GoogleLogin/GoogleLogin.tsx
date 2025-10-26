import React from "react";
import {
  GoogleLogin as GoogleLoginComponent,
  CredentialResponse,
} from "@react-oauth/google";
import "./GoogleLogin.css";

interface GoogleLoginProps {
  onSuccess: (user: any) => void;
  onError: (err: any) => void;
}

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess, onError }) => {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) return onError(new Error("No credential returned"));
    const profile = decodeJwt(token);
    if (!profile) return onError(new Error("Failed to decode token"));
    
    if (import.meta.env.VITE_ALLOWED_USER_LIST?.split(",").includes(profile.email)) {
      onSuccess(profile);
    } else {
      onError(new Error("User not allowed"));
    }
  };

  return (
    <div className="google-login-wrapper">
      <GoogleLoginComponent
        onSuccess={handleSuccess}
        onError={() => onError(new Error("Google login failed"))}
        shape="pill"
        size="large"
        width={300}
        text="signin"
      />
    </div>
  );
};

export default GoogleLogin;
