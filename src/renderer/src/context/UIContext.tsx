import { createContext, useContext } from 'react'

export type AppMode = 'weaver' | 'keeper' | 'settings'

export interface UIContextType {
  currentMode: AppMode
  setCurrentMode: (mode: AppMode) => void
  focusedNodeId?: string
  focusedColumn?: string
  setFocusedColumn: (column: string) => void
  setFocus: (nodeId: string, column?: string) => void
  isBusy: boolean
  busyNodeId?: string
  setBusy: (busy: boolean, nodeId?: string) => void
}

export const UIContext = createContext<UIContextType | undefined>(undefined)

export const useUI = (): UIContextType => {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
