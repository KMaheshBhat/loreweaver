import { Intent } from '@engine/model/hami'
import { PayloadAccessor, PayloadFlow } from '@engine/domain/hami'
import { createBaseNode } from '@engine/model/base'

/**
 * The Weaver Operational Adaptor.
 * Handles active narrative turn submissions and orchestrates
 * the transition from proposed to resolving states.
 */
export class WeaverIncubate implements PayloadFlow {
  public readonly id = 'weaver:incubate'

  public readonly kind = 'workflow'

  public readonly supportedIntents = ['submit-turn']

  /**
   * Executes the narrative turn submission workflow.
   * Processes all nodes carried by the intent and adds them to the ledger.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent containing the narrative turn nodes to process.
   */
  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    const ttt = accessor.getFlow('flow:synthesis:pi-ai-synthesis:incubate:openrouter-free')
    console.log(ttt)
    if (intent.kind === 'submit-turn') {
      // Loop through all nodes carried by the intent (Proposed + Updates)
      intent.nodes.forEach((node) => {
        accessor.addNode(node)
        console.log(`Weaver: node`, node)
      })
      const proposedNode = createBaseNode(`weave:turn:${Date.now()}-gen`)
        .withData({
          group: 'weave',
          title: 'TTTSynth response',
          content: '',
          timestamp: Date.now()
        })
        .withMeta({
          recordState: 'draft',
          engagementState: 'active'
        })
        .build()
      accessor.addNode(proposedNode)
      try {
        await ttt?.execute(accessor, intent, { proposedNodeId: proposedNode.id })
      } catch (e) {
        console.error(`Weaver: Failed to execute TTT synthesis flow:`, e)
      }

      console.log(`Weaver: Ingested ${intent.nodes.length} nodes for [Go! Go! Go!] sequence.`)
    }
  }
}
