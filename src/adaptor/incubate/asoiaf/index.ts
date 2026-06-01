import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { seedNodes } from './records'

/**
 * The ASOIAF Genesis Adaptor.
 * Orchestrates the "Inking" of the ASOIAF world into the Ledger.
 */
export class ASOIAFIncubate implements WorkflowProvider {
  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log('Genesis: Waking the Dragon in the Incubation Sandbox...')
      Object.values(seedNodes).forEach((node) => context.addNode(node))
    }
  }
}
