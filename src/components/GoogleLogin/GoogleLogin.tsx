import React from "react";
import "./GoogleLogin.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

interface GoogleAuthProps {
  onSuccess: (user: any) => void;
  onError: (err: any) => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, onError }) => {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const allowed = import.meta.env.VITE_ALLOWED_USER_LIST?.split(",") || [];
      if (allowed.length > 0 && !allowed.includes(user.email ?? "")) {
        await auth.signOut();
        throw new Error("User not allowed");
      }

      onSuccess({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    } catch (error) {
      console.error("Firebase login error:", error);
      onError(error);
    }
  };

  return (
    <div className="google-login-wrapper">
      <button className="google-login-button" onClick={handleLogin}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
        Prisijungti su Google
      </button>
    </div>
  );
};

export default GoogleAuth;
