import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { seedNodes } from './records'

/**
 * The Gritty Low Fantasy Genesis Adaptor.
 * Orchestrates the "Inking" of the world into the Ledger.
 */
export class GrittyLowFantasyIncubate implements WorkflowProvider {
  public readonly id = 'gritty-low-fantasy:incubate'

  public readonly supportedKinds = ['init']

  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log(
        'Sovereign Seal: Inking a world of grit, mud, and royals who think a hooded cloak counts as a disguise...'
      )
      Object.values(seedNodes).forEach((node) => context.addNode(node))
    }
  }
}
