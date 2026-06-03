import { Payload, PayloadFlow, PayloadAccessor } from '@engine/domain/hami'
import { TextToTextSynthesisProvider } from '@engine/port/synthesis'
import { Intent } from '@engine/model/hami'
import { GraphNode } from '@engine/model/base'

// TS Requirement: args MUST be any[] for Mixin compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GConstructor<T = object> = new (...args: any[]) => T

/**
 * The Synthesis Capability Mixin.
 * Bridges "Stochastic Fuel" (LLMs) into "Deterministic Gears" (Flows).
 */
export function WithSynthesisFlow<TBase extends GConstructor<Payload>>(Base: TBase): TBase {
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
      targetIntents: string[]
    ): PayloadFlow {
      return {
        id: `flow:synthesis:${provider.id}`,
        kind: 'synthesis',
        supportedIntents: targetIntents,
        execute: async (
          accessor: PayloadAccessor,
          intent: Intent,
          options?: Record<string, unknown>
        ): Promise<void> => {
          // Narrowing nodes to domain GraphNodes for context
          const contextNodes = Object.values(accessor.getNodes()) as GraphNode[]

          // Identification of the target "Neo State" node
          const responseNodeId = options?.proposedNodeId as string
          if (!responseNodeId) {
            console.error('Synthesis aborted: No proposedNodeId provided in options.')
            return
          }

          const stream = provider.generateStream(intent, contextNodes, options)
          console.log(`Synthesis stream aligned for node [${responseNodeId}]...`)

          let accumulatedProse = ''
          for await (const chunk of stream) {
            if (chunk.delta) {
              accumulatedProse += chunk.delta
              // Inking the 'resolving' state triggers targeted UI updates [1, 2]
              accessor.updateNode(
                responseNodeId,
                { content: accumulatedProse },
                { recordState: 'resolving' }
              )
            }
          }

          // Finalize: Transition the node to 'proposed' for the Weaver's review [3]
          accessor.updateNode(responseNodeId, {}, { recordState: 'proposed' })
          console.log(`Synthesis completed for node [${responseNodeId}].`)
        }
      }
    }
  }
}
