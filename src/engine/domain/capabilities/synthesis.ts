import { Payload, PayloadFlow, PayloadAccessor } from '@engine/domain/hami'
import { TextToTextSynthesisProvider } from '@engine/port/synthesis'
import { Intent } from '@engine/model/hami'
import { BaseNode } from '@engine/model/base'

export interface SynthesisFlowCapabilityOptions {
  id: string
  options?: Record<string, unknown>
}

/**
 * Explicit interface for the capability added by this mixin.
 * This satisfies the "Missing return type" and "Private property" issues.
 */
export interface SynthesisFlowCapability {
  createSynthesisFlow(
    provider: TextToTextSynthesisProvider,
    targetIntents: string[],
    options: SynthesisFlowCapabilityOptions
  ): PayloadFlow
}

// TS Requirement: args MUST be any[] for Mixin compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GConstructor<T = object> = new (...args: any[]) => T

/**
 * The Synthesis Capability Mixin.
 * Bridges "Stochastic Fuel" (LLMs) into "Deterministic Gears" (Flows).
 */
export function WithSynthesisFlow<TBase extends GConstructor<Payload>>(
  Base: TBase
): TBase & GConstructor<SynthesisFlowCapability> {
  return class extends Base {
    // TS Requirement: A mixin class must have this specific constructor signature
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    /**
     * Shared Factory: Wraps a synthesis provider into a standard PayloadFlow.
     * Manages the lifecycle from 'resolving' (streaming) to 'proposed'.
     */
    public createSynthesisFlow(
      provider: TextToTextSynthesisProvider,
      targetIntents: string[],
      options: SynthesisFlowCapabilityOptions
    ): PayloadFlow {
      const flowId = `flow:synthesis:${provider.id}:${options.id}`
      const baseOptions = options.options ?? {}
      return {
        id: flowId,
        kind: 'synthesis',
        supportedIntents: targetIntents,
        execute: async (
          accessor: PayloadAccessor,
          intent: Intent,
          options?: Record<string, unknown>
        ): Promise<void> => {
          // Narrowing nodes to domain GraphNodes for context
          const contextNodes = Object.values(accessor.getNodes()) as BaseNode[]

          // Identification of the target "Neo State" node
          const responseNodeId = options?.proposedNodeId as string
          if (!responseNodeId) {
            console.error('Synthesis aborted: No proposedNodeId provided in options.')
            return
          }

          const flowOptions = { ...baseOptions, ...options }
          const stream = provider.generateStream(intent, contextNodes, flowOptions)
          console.log(`Synthesis stream aligned for node [${responseNodeId}]...`)

          let accumulatedProse = ''
          let accumulatedThought = ''

          for await (const chunk of stream) {
            if (chunk.meta?.type === 'error') {
              console.error('Synthesis error:', chunk.meta)
              continue
            }

            if (chunk.delta) {
              if (chunk.meta?.type === 'thinking_delta') {
                accumulatedThought += chunk.delta
                // You can stream the thought processing to a dedicated metadata block
                accessor.updateNode(responseNodeId, {}, { transientThought: accumulatedThought })
              } else if (chunk.meta?.type === 'text_delta') {
                accumulatedProse += chunk.delta
                // Keep the main content clean and strictly character-facing
                accessor.updateNode(responseNodeId, { content: accumulatedProse }, {})
              }
            }
          }

          // Finalize: Commit the final code-clean prose and permanently store the thought process
          accessor.updateNode(
            responseNodeId,
            { content: accumulatedProse, thinkContent: accumulatedThought },
            {
              recordState: 'proposed'
            }
          )
        }
      }
    }
  }
}
