/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string
  readonly VITE_API_GATEWAY_URL?: string
  readonly VITE_ENABLE_AI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
