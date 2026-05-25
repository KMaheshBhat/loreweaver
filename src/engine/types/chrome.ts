import { GraphNode } from './base'

export interface ChromeNodeData {
  title: string
  routeMode: 'weaver' | 'keeper' | 'settings'
  availableInMenu: boolean
  icon: string
  [key: string]: unknown
}

export interface ChromeNode extends GraphNode {
  kind: 'chrome'
  data: ChromeNodeData
}
