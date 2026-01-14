/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MICROCMS_SERVICE_DOMAIN: string;
  readonly VITE_MICROCMS_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}