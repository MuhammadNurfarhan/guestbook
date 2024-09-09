/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // tambahkan variabel lain di sini jika diperlukan
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
