/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REEVIT_PUBLIC_KEY: string
  readonly VITE_REEVIT_ORG_ID: string
  readonly VITE_REEVIT_CONNECTION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
