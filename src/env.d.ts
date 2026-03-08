/// <reference types="vite/client" />

// Type declaration for the IPC bridge exposed via contextBridge in the preload script.
// This will be expanded as IPC methods are added in Milestone 2.
interface WindowApi {
  // Empty for now — populated in Milestone 2
}

declare global {
  interface Window {
    api: WindowApi
  }
}

export {}
