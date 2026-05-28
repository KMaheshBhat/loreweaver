import { GraphNode } from '../model/base'
import { Intent } from '../model/intent'

export interface TextSynthesisChunk {
  /** The real-time text segment delta generated during the active loop turn. */
  delta?: string

  /**
   * Open-ended metadata envelope populated dynamically by the active adapter chain.
   * Keeps the core engine agnostic while allowing adapters to inject provider-specific
   * metrics (e.g., tokens, stop reasons, or infrastructure statuses).
   */
  meta?: Record<string, unknown>
}

export interface TextToTextSynthesisProvider {
  /**
   * Dispatches an isolated text-generation frame to an abstract inference engine.
   * Returns a native async iterable stream that yields structured output chunks.
   *
   * @param intent The triggering engine intent governing the generation parameters.
   * @param context The computed context array matching layout and KV-cache constraints.
   * @param options Dynamic generation levers (e.g., custom temperature, top_p, engine overrides).
   */
  generateStream(
    intent: Intent,
    context: GraphNode[],
    options?: Record<string, unknown>
  ): AsyncIterable<TextSynthesisChunk>
}
