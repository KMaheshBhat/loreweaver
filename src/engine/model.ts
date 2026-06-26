import { createDataNode, DataEdge, DataNode } from '@hami-frameworx/core'

/**
 * Represents a directed relationship from one LoreWeaver base node to another.
 * Edges carry a discriminant `kind` and an opaque `data` payload, allowing
 * the engine to model typed relationships (e.g., causality-target,
 * introspection-target) without coupling the core model to any single domain.
 */
export interface BaseEdge extends DataEdge {
  toNodeId: string
  kind: string
  data: Record<string, unknown>
}

export interface BaseNodeData {
  group: string
  [key: string]: unknown
}

/**
 * The atomic unit of the Temporal Loom.
 * A `BaseNode` is a versioned, addressable record whose `data` holds the
 * domain-specific payload and whose `meta` carries engine bookkeeping
 * (e.g., `recordState`, `engagementState`).
 */

export interface BaseNode extends DataNode {
  kind: 'loreweaver:generic'
  data: BaseNodeData
}

/** Lookup table mapping node ids to their corresponding `BaseNode` instances. */
export type BaseNodeMap = Record<string, BaseNode>

/**
 * Fluent builder API for constructing `BaseNode` instances.
 * Provides a chainable, type-safe surface for assembling nodes with
 * kind, data, edges, and meta payloads.
 */
export interface BaseNodeBuilder {
  withKind(kind: string): this
  withData(data: Record<string, unknown>): this
  withEdge(edge: BaseEdge): this
  withEdges(edge: BaseEdge[]): this
  withMeta(data: Record<string, unknown>): this
  withGroup(group: string): this
  build(): BaseNode
}

/**
 * Creates a fluent builder for assembling a `BaseNode` with the given id.
 *
 * @param id The stable identifier of the node being constructed.
 * @returns A `BaseNodeBuilder` seeded with the provided id.
 */
export function createBaseNode(id: string): BaseNodeBuilder {
  const dataNode = createDataNode(id).withKind('loreweaver:generic')
  let group = ''
  const builder: BaseNodeBuilder = {
    withKind(k) {
      if (k.startsWith('loreweaver:')) {
        dataNode.withKind(k)
      } else {
        dataNode.withKind(`loreweaver:${k}`)
      }
      return this
    },
    withData(d) {
      dataNode.withData(d)
      return this
    },
    withEdge(e) {
      dataNode.withEdge(e)
      return this
    },
    withEdges(e) {
      dataNode.withEdges(e)
      return this
    },
    withMeta(m) {
      dataNode.withMeta(m)
      return this
    },
    withGroup(g) {
      group = g
      return this
    },
    build() {
      const rawNode = dataNode.build()
      return {
        ...rawNode,
        data: {
          ...rawNode.data,
          group
        }
      } as BaseNode
    }
  }
  return builder
}
