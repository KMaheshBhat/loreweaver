import { Intent } from '@engine/model/intent'
import { GraphNode } from '@engine/model/base'

/**
 * The Capability Object passed to a workflow during execution.
 * These methods are wrapped by the Ledger to ensure telemetry,
 * validation, and granular event broadcasting.
 */
export interface WorkflowContext {
  addNode: (node: GraphNode) => void
  updateNode: (
    id: string,
    data: Partial<Record<string, unknown>>,
    meta: Partial<Record<string, unknown>>
  ) => void
  removeNode: (id: string) => void
  commitBatch: (ids: string[]) => void
}

/**
 * The contract for a workflow participant.
 * Implementations of this interface register with the ledger to
 * handle specific intent kinds and execute deterministic logic
 * against the graph state.
 */
export interface WorkflowProvider {
  /** A unique identifier for the participant (e.g., 'causality-accounting') */
  id: string

  /**
   * The list of intent kinds this participant reflects/participates in.
   * e.g., ['submit-turn', 'init']
   */
  supportedKinds: string[]

  /**
   * Executes a deterministic sequence against the engine state.
   * @param context The Ledger-provided capabilities for state mutation.
   * @param intent The client input intent payload injected into the pipeline conduit.
   * @param options Dynamic supervisor configurations (e.g., skip-mechanics flags, telemetry overrides).
   */
  execute(
    context: WorkflowContext,
    intent: Intent,
    options?: Record<string, unknown>
  ): Promise<void>
}
