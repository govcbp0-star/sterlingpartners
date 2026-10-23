interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY: string;
  readonly VITE_FIRM_PHONE: string;
  readonly VITE_FIRM_WHATSAPP: string;
  readonly VITE_FIRM_EMAIL: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_ADMIN_UID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
