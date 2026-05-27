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
