export interface DataEdge {
  toNodeId: string
  kind: string
  data: Record<string, unknown>
}

export interface DataNode {
  id: string
  kind: string
  data: Record<string, unknown>
  edges: Array<DataEdge>
  meta: Record<string, unknown>
}

export type DataNodeMap = Record<string, DataNode>

export interface DataNodeBuilder {
  withKind(kind: string): this
  withData(data: Record<string, unknown>): this
  withEdge(edge: DataEdge): this
  withEdges(edge: DataEdge[]): this
  withMeta(meta: Record<string, unknown>): this
  build(): DataNode
}

export function createDataNode(id: string): DataNodeBuilder {
  let kind = 'generic'
  let data: Record<string, unknown> = {}
  let meta: Record<string, unknown> = {}
  const edges: DataEdge[] = []
  const builder: DataNodeBuilder = {
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
    withEdges(e) {
      edges.push(...e)
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

export interface Intent {
  id: string
  kind: string
  nodes: DataNode[]
  options?: Record<string, unknown>
}
