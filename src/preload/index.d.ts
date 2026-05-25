import { ElectronAPI } from '@electron-toolkit/preload'
import { GraphNode } from '@engine/types/base'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      engine: {
        querySidebarNodes: () => Promise<GraphNode[]>
      }
    }
  }
}
