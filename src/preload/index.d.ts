import { ElectronAPI } from '@electron-toolkit/preload'
import { ChromeNode } from '@engine/types/chrome'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      engine: {
        client: () => Promise<GraphNode>
        chrome: {
          sidebarNodes: () => Promise<ChromeNode[]>
        }
        weaver: {
          nodes(): Promise<GraphNode[]>
        }
      }
    }
  }
}
