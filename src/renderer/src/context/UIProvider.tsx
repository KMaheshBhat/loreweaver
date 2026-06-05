import { ReactNode, ReactElement, useState, useCallback, useEffect } from 'react'
import { UIContext, AppMode } from './UIContext'
import { BaseNode } from '@engine/model/base'

export const UIProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [currentMode, setMode] = useState<AppMode>('weaver')
  const [focusedNodeId, setFocusedNodeId] = useState<string | undefined>()
  const [focusedColumn, setFocusedColumnInternal] = useState<string | undefined>()
  const [busyNodeId, setBusyNodeId] = useState<string | undefined>()
  const isBusy = !!busyNodeId

  const setBusy = useCallback((busy: boolean, nodeId?: string) => {
    setBusyNodeId(busy ? nodeId : undefined)
  }, [])

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

  // The Orchestrator Loop: Synchronizes UI Lock with Engine Ledger
  useEffect(() => {
    // 1. THE LOCK: Listen for when Weaver creates the 'draft' response node [1]
    const removeCreatedListener = window.electron.ipcRenderer.on(
      'node:created',
      (_event, node: BaseNode) => {
        if (node.meta?.recordState === 'draft') {
          console.log(`UI Orchestrator: Engine is weaving node [${node.id}] - Locking UI.`)
          setBusyNodeId(node.id)
        }
      }
    )

    // 2. THE UNLOCK: Listen for when that specific node transitions to 'proposed' [4, 5]
    const removeUpdatedListener = window.electron.ipcRenderer.on(
      'node:updated',
      (_event, node: BaseNode) => {
        if (node.id === busyNodeId && node.meta?.recordState === 'proposed') {
          console.log(`UI Orchestrator: Node [${node.id}] stabilized - Releasing UI.`)
          setBusyNodeId(undefined)
        }
      }
    )

    return () => {
      removeCreatedListener()
      removeUpdatedListener()
    }
  }, [busyNodeId])

  return (
    <UIContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        focusedNodeId,
        focusedColumn,
        setFocus,
        setFocusedColumn,
        isBusy,
        setBusy
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
