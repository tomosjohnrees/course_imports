import { contextBridge } from 'electron'

// Expose an empty API surface for now.
// This will be populated with IPC methods in Milestone 2.
contextBridge.exposeInMainWorld('api', {})
