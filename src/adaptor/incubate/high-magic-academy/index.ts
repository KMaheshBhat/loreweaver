import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { seedNodes } from './records'

/**
 * The High Magic Academy Genesis Adaptor.
 * Orchestrates the "Inking" of the high magic academy world into the Ledger.
 * Responsible for seeding the narrative state, characters, and scenario nodes.
 */
export class HighMagicAcademyIncubate implements WorkflowProvider {
  public readonly id = 'high-magic-academy:incubate'

  public readonly supportedKinds = ['init']

  /**
   * Executes the high magic academy initialization workflow.
   * Seeds the ledger with narrative nodes when an 'init' intent is received.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent triggering this workflow.
   */
  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log(
        'Arcane Vault: Lighting the lanterns. Try not to shatter any memories or unauthorized spells today...'
      )
      Object.values(seedNodes).forEach((node) => context.addNode(node))
    }
  }
}
