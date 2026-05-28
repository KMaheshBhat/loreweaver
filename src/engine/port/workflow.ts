import { Intent } from '../model/intent'

export interface WorkflowProvider {
  /**
   * Drives a rigid, multi-step execution pipeline loop against the central engine state.
   * * @param intent The client input intent payload injected into the pipeline conduit.
   * @param options Dynamic supervisor configurations (e.g., skip-mechanics flags, telemetry overrides).
   */
  execute(intent: Intent, options?: Record<string, unknown>): Promise<void>
}
