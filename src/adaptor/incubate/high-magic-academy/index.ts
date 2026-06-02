import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { seedNodes } from './records'

/**
 * The High Magic Academy Genesis Adaptor.
 * Orchestrates the "Inking" of the world into the Ledger.
 */
export class HighMagicAcademyIncubate implements WorkflowProvider {
  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log(
        'Arcane Vault: Lighting the lanterns. Try not to shatter any memories or unauthorized spells today...'
      )
      Object.values(seedNodes).forEach((node) => context.addNode(node))
    }
  }
}
