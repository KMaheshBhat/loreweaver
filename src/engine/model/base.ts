/**
 * Represents a directed relationship from one graph node to another.
 * Edges carry a discriminant `kind` and an opaque `data` payload, allowing
 * the engine to model typed relationships (e.g., causality-target,
 * introspection-target) without coupling the core model to any single domain.
 */
export interface GraphEdge {
  toNodeId: string
  kind: string
  data: Record<string, unknown>
}

/**
 * The atomic unit of the Temporal Loom.
 * A `GraphNode` is a versioned, addressable record whose `data` holds the
 * domain-specific payload and whose `meta` carries engine bookkeeping
 * (e.g., `recordState`, `engagementState`).
 */
export interface GraphNode {
  id: string
  kind: string
  data: Record<string, unknown>
  edges: Array<GraphEdge>
  meta: Record<string, unknown>
}

/** Lookup table mapping node ids to their corresponding `GraphNode` instances. */
export type GraphNodeMap = Record<string, GraphNode>

/**
 * Fluent builder API for constructing `GraphNode` instances.
 * Provides a chainable, type-safe surface for assembling nodes with
 * kind, data, edges, and meta payloads.
 */
export interface GraphNodeBuilder {
  withKind(kind: string): this
  withData(data: Record<string, unknown>): this
  withEdge(edge: GraphEdge): this
  withMeta(data: Record<string, unknown>): this
  build(): GraphNode
}

/**
 * Creates a fluent builder for assembling a `GraphNode` with the given id.
 *
 * @param id The stable identifier of the node being constructed.
 * @returns A `GraphNodeBuilder` seeded with the provided id.
 */
export function createGraphNode(id: string): GraphNodeBuilder {
  let kind = 'generic'
  let data: Record<string, unknown> = {}
  let meta: Record<string, unknown> = {}
  const edges: GraphEdge[] = []
  const builder: GraphNodeBuilder = {
    withKind(k) {
      kind = k
      return this
    },
    withData(d) {
      data = d
      return this
    },
    withEdge(e) {
      edges.push(e)
      return this
    },
    withMeta(m) {
      meta = m
      return this
    },
    build() {
      return { id, kind, data, edges, meta }
    }
  }
  return builder
}
