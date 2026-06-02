import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'

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
    if (intent.kind === 'submit-turn') {
      // Loop through all nodes carried by the intent (Proposed + Updates)
      intent.nodes.forEach((node) => {
        context.addNode(node)
      })

      console.log(`Weaver: Ingested ${intent.nodes.length} nodes for [Go! Go! Go!] sequence.`)
    }
  }
}
