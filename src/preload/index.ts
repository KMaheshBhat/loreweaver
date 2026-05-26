import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  engine: {
    client: () => ipcRenderer.invoke('client:node'),
    chrome: {
      sidebarNodes: () => ipcRenderer.invoke('chrome:nodes:sidebar'),
      exitApp: () => ipcRenderer.send('engine:chrome:exit')
    },
    weaver: {
      nodes: () => ipcRenderer.invoke('weaver:nodes')
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
