import { GraphNode } from './base'

/**
 * An `Intent` is the immutable input envelope dispatched into the engine's
 * workflow pipeline. It carries the kind of operation being requested,
 * any client-supplied graph nodes, and free-form metadata for downstream
 * participants to consume.
 */
export interface Intent {
  id: string
  kind: string
  nodes: GraphNode[]
  meta: Record<string, unknown>
}
