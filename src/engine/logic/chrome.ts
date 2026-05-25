import { GraphNode, GraphNodeMap } from '@engine/types/base'
import { ChromeNode, ChromeNodeData } from '@engine/types/chrome'
import { createGraphNode, GraphNodeBuilder } from './base'

export function isChromeNode(node: GraphNode): node is ChromeNode {
  return node.kind === 'chrome' && typeof node.data === 'object' && node.data !== null
}

export function querySidebarNodes(nodeMap: GraphNodeMap): GraphNode[] {
  console.log(nodeMap)
  return Object.values(nodeMap)
    .filter(isChromeNode)
    .filter((node) => node.data.availableInMenu === true)
}

export interface ChromeNodeBuilder extends GraphNodeBuilder {
  withTitle(title: string): ChromeNodeBuilder
  withRouteMode(routeMode: ChromeNodeData['routeMode']): ChromeNodeBuilder
  withMenuVisibility(availableInMenu: boolean): ChromeNodeBuilder
  withIcon(icon: string): ChromeNodeBuilder
  build(): ChromeNode
}

export function createChromeNode(id: string): ChromeNodeBuilder {
  const base = createGraphNode(id).withKind('chrome')
  let title = id
  let routeMode = id
  let availableInMenu = false
  let icon = ''
  const builder: ChromeNodeBuilder = {
    withKind(k) {
      base.withKind(k)
      return this
    },
    withData(d) {
      base.withData(d)
      return this
    },
    withEdge(e) {
      base.withEdge(e)
      return this
    },
    withTitle(t) {
      title = t
      return this
    },
    withRouteMode(r) {
      routeMode = r
      return this
    },
    withMenuVisibility(a) {
      availableInMenu = a
      return this
    },
    withIcon(i) {
      icon = i
      return this
    },
    build(): ChromeNode {
      const rawNode = base.build()
      return {
        ...rawNode,
        data: {
          ...rawNode.data,
          title,
          routeMode,
          availableInMenu,
          icon
        }
      } as ChromeNode
    }
  }
  return builder
}
