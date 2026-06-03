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

export interface Intent {
  id: string
  kind: string
  nodes: DataNode[]
  options?: Record<string, unknown>
}
