import { DataNode, DataNodeMap, Intent } from '@engine/model/hami'
import EventEmitter from 'events'

export interface PayloadAccessor {
  getNode(id: string): DataNode | undefined
  getNodes(): DataNodeMap
  addNode: (node: DataNode) => void
  updateNode: (
    id: string,
    data: Partial<Record<string, unknown>>,
    meta: Partial<Record<string, unknown>>
  ) => void
  removeNode: (id: string) => void
  getFlow(id: string): PayloadFlow | undefined
}

export interface PayloadFlow {
  id: string
  kind: string
  supportedIntents: string[]
  execute: (
    accessor: PayloadAccessor,
    intent: Intent,
    options?: Record<string, unknown>
  ) => Promise<void>
}

export type PayloadFlowMap = Record<string, PayloadFlow>

export class Payload extends EventEmitter {
  private nodes: DataNodeMap = {}
  private flows: PayloadFlowMap = {}

  constructor() {
    super()
    this.setMaxListeners(1000)
  }

  getNode(id: string): DataNode | undefined {
    return this.nodes[id]
  }

  getNodes(): DataNodeMap {
    return this.nodes
  }

  private addNode(node: DataNode): void {
    this.nodes[node.id] = node
    this.nNotify(node.id, 'created')
  }

  private updateNode(
    id: string,
    data: Partial<Record<string, unknown>>,
    meta: Partial<Record<string, unknown>>
  ): void {
    const node = this.nodes[id]
    if (!node) return
    data && (node.data = { ...node.data, ...data })
    meta && (node.meta = { ...node.meta, ...meta })
    this.nNotify(id, 'updated')
  }

  private removeNode(id: string): void {
    const node = this.nodes[id]
    if (node) {
      delete this.nodes[id]
      this.nNotify(id, 'removed')
    }
  }

  addFlow(flow: PayloadFlow): void {
    this.flows[flow.id] = flow
    this.fNotify(flow.id, 'added')
  }

  removeFlow(id: string): void {
    delete this.flows[id]
    this.fNotify(id, 'removed')
  }

  async runFlow(intent: Intent, options?: Record<string, unknown>): Promise<void> {
    console.log(Object.keys(this.flows))
    const accessors: PayloadAccessor = {
      getNode: (id: string) => this.getNode(id),
      getNodes: () => this.getNodes(),
      addNode: (node: DataNode) => this.addNode(node),
      updateNode: (
        id: string,
        data: Partial<Record<string, unknown>>,
        meta: Partial<Record<string, unknown>>
      ) => this.updateNode(id, data, meta),
      removeNode: (id: string) => this.removeNode(id),
      getFlow: (id: string): PayloadFlow | undefined => {
        return this.flows[id]
      }
    }
    for (const flow of Object.values(this.flows)) {
      if (flow.supportedIntents.includes(intent.kind)) {
        flow.execute(accessors, intent, options)
      }
    }
  }

  private nNotify(id: string, type: 'created' | 'updated' | 'removed'): void {
    const node = this.nodes[id]
    this.emit(`node:${type}`, node || { id })
    if (type === 'updated' && node) {
      this.emit(`node:updated:${id}`, node)
    }
  }

  private fNotify(id: string, type: 'added' | 'removed'): void {
    const flow = this.flows[id]
    this.emit(`flow:${type}`, id, flow)
  }
}
