import { ReactNode, ReactElement, useState, useCallback } from 'react'
import { UIContext, AppMode } from './UIContext'

export const UIProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [currentMode, setMode] = useState<AppMode>('weaver')
  const [focusedNodeId, setFocusedNodeId] = useState<string | undefined>()
  const [focusedColumn, setFocusedColumnInternal] = useState<string | undefined>()

  /**
   * Enhanced Mode Setter:
   * Transitions mode and resets viewport focus to clear the Matrix.
   */
  const setCurrentMode = useCallback((mode: AppMode) => {
    setMode(mode)
    setFocusedNodeId(undefined)
    setFocusedColumnInternal(undefined) // Resets geometric focus
  }, [])

  /**
   * Node-Specific Focus:
   * Sets the active card and optionally shifts the column geometry.
   */
  const setFocus = useCallback((nodeId: string, column?: string) => {
    setFocusedNodeId(nodeId)
    if (column) setFocusedColumnInternal(column)
  }, [])

  /**
   * Geometric-Only Focus:
   * Directly shifts the SoX layout (e.g., from the Input Forge)
   * without deselecting the current node.
   */
  const setFocusedColumn = useCallback((column?: string) => {
    setFocusedColumnInternal(column)
  }, [])

  return (
    <UIContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        focusedNodeId,
        focusedColumn,
        setFocus,
        setFocusedColumn
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
