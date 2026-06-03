import { GraphNode } from '@engine/model/base'
import { Intent } from '@engine/model/hami'
import { TextToTextSynthesisProvider } from '@engine/port/synthesis'
import { Payload, PayloadAccessor, PayloadFlow } from './hami'

export class Ledger extends Payload {
  public override getNode(id: string): GraphNode | undefined {
    return super.getNode(id) as GraphNode
  }

  public getGraphNodes(): GraphNode[] {
    return Object.values(this.getNodes()) as GraphNode[]
  }

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
        const contextNodes = Object.values(accessor.getNodes()) as GraphNode[]

        const responseNodeId = String(options?.proposedNodeId)
        if (!responseNodeId) return

        const stream = provider.generateStream(intent, contextNodes, options)
        console.log('Synthesis stream aligned...')

        let accumulatedProse = ''
        for await (const chunk of stream) {
          console.log('Synthesis chunk received:', chunk)
          if (chunk.delta) {
            accumulatedProse += chunk.delta
            accessor.updateNode(
              responseNodeId,
              { content: accumulatedProse },
              { recordState: 'resolving' }
            )
          }
        }
        accessor.updateNode(responseNodeId, {}, { recordState: 'proposed' })
      }
    }
  }
}
