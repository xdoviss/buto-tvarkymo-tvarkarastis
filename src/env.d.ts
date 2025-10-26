interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_ALLOWED_USER_LIST?: string;

  // Firebase
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;

  // Flatmate specific
  readonly VITE_FLATMATE_ROKAS?: string;
  readonly VITE_FLATMATE_GUODA?: string;
  readonly VITE_FLATMATE_DOVYDAS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
