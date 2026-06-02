import { GraphNode, GraphNodeMap } from '@engine/model/base'
import { Intent } from '@engine/model/intent'
import { WorkflowContext, WorkflowProvider } from '@engine/port/workflow'
import { EventEmitter } from 'events'

/**
 * The Central State Ledger (God Object).
 * Authoritative mutator of the application's runtime reality.
 * The consumer application is free to have multiple Ledger instances, each with its own isolated state.
 */
export class Ledger extends EventEmitter {
  private nodes: GraphNodeMap = {}
  private participants: WorkflowProvider[] = []

  constructor() {
    super()
    this.setMaxListeners(1000)
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes[id]
  }

  getNodes(): GraphNode[] {
    return Object.values(this.nodes)
  }

  public registerWorkflowProvider(participant: WorkflowProvider): void {
    if (!this.participants.find((p) => p.id === participant.id)) {
      this.participants.push(participant)
      console.log(`Ledger: Registered participant [${participant.id}]`)
    }
  }

  async runWorkflow(intent: Intent, options?: Record<string, unknown>): Promise<void> {
    const context: WorkflowContext = {
      addNode: (node) => this.add(node),
      updateNode: (id, data, meta) => this.update(id, data, meta),
      removeNode: (id) => this.remove(id),
      commitBatch: (ids) => this.commit(ids)
    }
    console.log(`Ledger: Running workflow [${intent.id}] from ${intent.meta.source}`)
    for (const participant of this.participants) {
      if (participant.supportedKinds.includes(intent.kind)) {
        await participant.execute(context, intent, options)
      }
    }
  }

  private add(node: GraphNode): void {
    this.nodes[node.id] = node
    this.notify(node.id, 'created')
  }

  private update(
    id: string,
    data: Partial<Record<string, unknown>>,
    meta?: Partial<Record<string, unknown>>
  ): void {
    const node = this.nodes[id]
    if (!node) return
    if (data) node.data = { ...node.data, ...data }
    if (meta) node.meta = { ...node.meta, ...meta }
    this.notify(id, 'updated')
  }

  private remove(id: string): void {
    const node = this.nodes[id]
    if (node) {
      delete this.nodes[id]
      this.notify(id, 'removed')
    }
  }

  private commit(ids: string[]): void {
    for (const id of ids) {
      const node = this.nodes[id]
      if (node) {
        node.meta.recordState = 'committed'
        this.notify(id, 'updated')
      }
    }
  }

  /**
   * Unified notification bus.
   * Dispatches structural shifts (created/removed) and state shifts (updated).
   */
  private notify(id: string, type: 'created' | 'updated' | 'removed'): void {
    const node = this.nodes[id]
    // 1. Structural/Collection Notification (for Layout components) [12]
    this.emit(`node:${type}`, node || { id })
    // 2. Targeted/Leaf Notification (for Detail components) [12]
    if (type === 'updated' && node) {
      this.emit(`node:updated:${id}`, node)
    }
  }
}
