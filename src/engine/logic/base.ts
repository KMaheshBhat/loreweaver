import { GraphEdge, GraphNode } from '@engine/types/base'

export interface GraphNodeBuilder {
  withKind(kind: string): this
  withData(data: Record<string, unknown>): this
  withEdge(edge: GraphEdge): this
  build(): GraphNode
}

export function createGraphNode(id: string): GraphNodeBuilder {
  let kind = 'generic'
  let data: Record<string, unknown> = {}
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
    build() {
      return { id, kind, data, edges }
    }
  }
  return builder
}
