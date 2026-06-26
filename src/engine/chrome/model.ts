import { BaseNode, BaseNodeBuilder, BaseNodeData, createBaseNode } from '@engine/model'

export const kindChromeFlow = 'loreweaver:chrome:flow'

/**
 * Payload shape for a Chrome (application chrome) node.
 * Describes a top-level application surface such as a primary mode
 * (Weaver, Keeper, Settings) and its menu/visibility configuration.
 */
export interface ChromeNodeData extends BaseNodeData {
  title: string
  routeMode: 'weaver' | 'keeper' | 'settings'
  availableInMenu: boolean
  icon: string
  [key: string]: unknown
}

/**
 * A `GraphNode` specialized to carry Chrome (application shell) metadata.
 * Used by the System of Experience to render navigation and route state.
 */
export interface ChromeNode extends BaseNode {
  data: ChromeNodeData
}

/**
 * Fluent builder API for constructing `ChromeNode` instances.
 * Mirrors `GraphNodeBuilder` while enforcing the chrome-specific data shape.
 */
export interface ChromeNodeBuilder extends BaseNodeBuilder {
  withTitle(title: string): ChromeNodeBuilder
  withRouteMode(routeMode: ChromeNodeData['routeMode']): ChromeNodeBuilder
  withMenuVisibility(availableInMenu: boolean): ChromeNodeBuilder
  withIcon(icon: string): ChromeNodeBuilder
  build(): ChromeNode
}

/**
 * Creates a fluent builder for assembling a `ChromeNode` with the given id.
 *
 * @param id The stable identifier of the chrome node being constructed.
 * @returns A `ChromeNodeBuilder` seeded with the provided id.
 */
export function createChromeNode(id: string): ChromeNodeBuilder {
  const base = createBaseNode(id).withKind('loreweaver:chrome:generic')
  let title = id
  let routeMode = id
  let availableInMenu = false
  let icon = ''
  const builder: ChromeNodeBuilder = {
    withKind(k) {
      if (k.startsWith('loreweaver:chrome:')) {
        base.withKind(k)
      } else {
        base.withKind(`loreweaver:${k}`)
      }
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
    withEdges(e) {
      base.withEdges(e)
      return this
    },
    withMeta(m) {
      base.withMeta(m)
      return this
    },
    withGroup(g) {
      base.withGroup(g)
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

/**
 * Type guard that determines whether a `GraphNode` is a `ChromeNode`.
 *
 * @param node The node to test.
 * @returns True if the node carries chrome-typed data.
 */
export function isChromeNode(node: BaseNode): node is ChromeNode {
  return (
    node.kind.startsWith('loreweaver:chrome') && typeof node.data === 'object' && node.data !== null
  )
}

/**
 * Type guard that determines whether a `GraphNode` represents a sidebar entry.
 * Sidebar nodes are chrome nodes explicitly marked as visible in the navigation menu.
 *
 * @param node The node to test.
 * @returns True if the node should appear in the sidebar.
 */
export function isSidebarNode(node: BaseNode): node is ChromeNode {
  return isChromeNode(node) && node.data.availableInMenu === true
}
