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
  private workflowProviders: WorkflowProvider[] = []

  constructor() {
    super()
    this.setMaxListeners(1000)
  }

  /**
   * Retrieves a single node by its id.
   *
   * @param id The unique identifier of the node to retrieve.
   * @returns The node if found, undefined otherwise.
   */
  getNode(id: string): GraphNode | undefined {
    return this.nodes[id]
  }

  /**
   * Returns all nodes currently in the ledger.
   *
   * @returns An array of all nodes.
   */
  getNodes(): GraphNode[] {
    return Object.values(this.nodes)
  }

  /**
   * Registers a workflow participant to receive intents of specific kinds.
   * Participants receive intents that match their `supportedKinds` array.
   *
   * @param participant The workflow provider to register.
   */
  public registerWorkflowProvider(participant: WorkflowProvider): void {
    if (!this.workflowProviders.find((p) => p.id === participant.id)) {
      this.workflowProviders.push(participant)
      console.log(`Ledger: Registered participant [${participant.id}]`)
    }
  }

  /**
   * Retrieves a workflow provider by its ID.
   * @param id The ID of the workflow provider to retrieve.
   * @returns The workflow provider with the specified ID, or `undefined` if not found.
   */
  public getWorkflowProvider(id: string): WorkflowProvider | undefined {
    return this.workflowProviders.find((p) => p.id === id)
  }

  /**
   * Dispatches an intent to all registered workflow participants that support its kind.
   * Each participant receives a context object containing mutation capabilities.
   *
   * @param intent The intent to dispatch through the workflow pipeline.
   * @param options Optional configuration for the workflow execution.
   */
  async runWorkflow(intent: Intent, options?: Record<string, unknown>): Promise<void> {
    const context: WorkflowContext = {
      addNode: (node) => this.add(node),
      updateNode: (id, data, meta) => this.update(id, data, meta),
      removeNode: (id) => this.remove(id),
      commitBatch: (ids) => this.commit(ids)
    }
    console.log(`Ledger: Running workflow [${intent.id}] from ${intent.meta.source}`)
    for (const participant of this.workflowProviders) {
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
