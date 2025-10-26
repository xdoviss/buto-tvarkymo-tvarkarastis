import React from "react";
import {
  GoogleLogin as RawGoogleLogin,
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
    onSuccess(profile);
  };

  return (
    <div className="google-login-wrapper">
      <RawGoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError(new Error("Google login failed"))}
      />
    </div>
  );
};

export default GoogleLogin;
