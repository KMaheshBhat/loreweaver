// src/main/ledger.ts
import { ipcMain } from 'electron'
import { GraphNode, GraphNodeMap } from '@engine/types/base'
import { createChromeNode, querySidebarNodes } from '@engine/logic/chrome'
import { createGraphNode } from '@engine/logic/base'

// 1. The central in-memory ledger (State)
const centralLedger: GraphNodeMap = {
  app: createGraphNode('app')
    .withData({
      icon: '',
      title: 'LoreWeaver',
      version: process.env.npm_package_version,
      name: process.env.npm_package_name
    })
    .build(),
  weaver: createChromeNode('weaver')
    .withTitle('Weaver')
    .withIcon('󰋘')
    .withMenuVisibility(true)
    .build(),
  keeper: createChromeNode('keeper')
    .withTitle('Keeper')
    .withIcon('󰋘')
    .withMenuVisibility(true)
    .build(),
  settings: createChromeNode('settings')
    .withTitle('Settings')
    .withIcon('󰒓')
    .withMenuVisibility(true)
    .build(),
  'secret-node': createGraphNode('secret-node')
    .withData({ content: 'Should not show in sidebar' })
    .build()
}

export function setupHandlers(): void {
  ipcMain.handle('app:node', async (): Promise<GraphNode> => {
    return centralLedger.app
  })
  ipcMain.handle('chrome:sidebar-nodes', async (): Promise<GraphNode[]> => {
    return querySidebarNodes(centralLedger)
  })
}
