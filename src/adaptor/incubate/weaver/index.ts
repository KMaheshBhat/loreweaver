import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { createGraphNode } from '@engine/model/base'

/**
 * The Weaver Operational Adaptor.
 * Handles active narrative turn submissions and orchestrates
 * the transition from proposed to resolving states.
 */
export class WeaverIncubate implements WorkflowProvider {
  public readonly id = 'weaver:incubate'

  public readonly supportedKinds = ['submit-turn']

  /**
   * Executes the narrative turn submission workflow.
   * Processes all nodes carried by the intent and adds them to the ledger.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent containing the narrative turn nodes to process.
   */
  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    const ttt = context.getTextToTextSynthesisProviders()[0]
    if (intent.kind === 'submit-turn') {
      // Loop through all nodes carried by the intent (Proposed + Updates)
      intent.nodes.forEach((node) => {
        context.addNode(node)
        console.log(`Weaver: node`, node)
      })
      const proposedNode = createGraphNode(`weave:turn:${Date.now()}-gen`)
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
      context.addNode(proposedNode)
      const stream = ttt.generateStream(intent, intent.nodes)
      let accumulatedContent = proposedNode.data.content ?? ''
      for await (const chunk of stream) {
        if (chunk.delta) {
          accumulatedContent += chunk.delta
          context.updateNode(proposedNode.id, { content: accumulatedContent }, {})
        }
      }
      context.updateNode(proposedNode.id, {}, { recordState: 'proposed' })

      console.log(`Weaver: Ingested ${intent.nodes.length} nodes for [Go! Go! Go!] sequence.`)
    }
  }
}
