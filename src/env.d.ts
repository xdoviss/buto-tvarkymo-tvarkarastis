interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_ALLOWED_USER_LIST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
