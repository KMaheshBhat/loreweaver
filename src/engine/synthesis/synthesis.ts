import { BaseNode } from '@engine/model'
import { Intent } from '@hami-frameworx/core'

/**
 * A chunk of text generated during streaming synthesis.
 * Carries the actual text delta and optional metadata from the
 * underlying text-generation provider.
 */
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

/**
 * The text-generation contract for the System of Synthesis.
 * Implementations of this interface are responsible for dispatching
 * text-generation requests and streaming back structured chunks.
 */
export interface TextToTextSynthesisProvider {
  kind: string

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
    context: BaseNode[],
    options?: Record<string, unknown>
  ): AsyncIterable<TextSynthesisChunk>
}
