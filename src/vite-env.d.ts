/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CGEN_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
