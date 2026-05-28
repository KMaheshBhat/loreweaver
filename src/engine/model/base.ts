export interface GraphEdge {
  toNodeId: string
  kind: string
  data: Record<string, unknown>
}

export interface GraphNode {
  id: string
  kind: string
  data: Record<string, unknown>
  edges: Array<GraphEdge>
  meta: Record<string, unknown>
}

export type GraphNodeMap = Record<string, GraphNode>

export interface GraphNodeBuilder {
  withKind(kind: string): this
  withData(data: Record<string, unknown>): this
  withEdge(edge: GraphEdge): this
  withMeta(data: Record<string, unknown>): this
  build(): GraphNode
}

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
