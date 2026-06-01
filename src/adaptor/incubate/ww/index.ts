import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { seedNodes } from './records'

/**
 * The WW Genesis Adaptor.
 * Orchestrates the "Inking" of the Wizarding World into the Ledger.
 */
export class WWIncubate implements WorkflowProvider {
  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log('Genesis: Waking the Dragon in the Incubation Sandbox...')
      Object.values(seedNodes).forEach((node) => context.addNode(node))
    }
  }
}
