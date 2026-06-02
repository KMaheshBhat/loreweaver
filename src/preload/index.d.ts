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
          exitApp: () => void
        }
        weaver: {
          nodes(): Promise<GraphNode[]>
          /**
           * Dispatches a proposed narrative turn (GraphNodes) to the engine
           * for ingestion and synthesis resolution.
           */
          submitTurn(node: GraphNode | GraphNode[]): Promise<void>
        }
      }
    }
  }
}
