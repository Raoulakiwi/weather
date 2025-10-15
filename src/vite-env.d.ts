/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string
  readonly VITE_WEATHERAPI_KEY: string
  readonly VITE_TOMORROW_API_KEY: string
  readonly VITE_VISUAL_CROSSING_API_KEY: string
  readonly VITE_WEATHERBIT_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

