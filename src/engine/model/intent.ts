import { GraphNode } from './base'

export interface Intent {
  id: string
  kind: string
  nodes: GraphNode[]
  meta: Record<string, unknown>
}
