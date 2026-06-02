import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { seedNodes } from './records'

/**
 * The Chrome Adaptor.
 * Orchestrates the configuration of Chrome the into the Ledger.
 */
export class ChromeIncubate implements WorkflowProvider {
  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log(
        'Loom Throne: Stabilizing the System Frame. Please keep your hands and feet inside the viewport...'
      )
      Object.values(seedNodes).forEach((node) => context.addNode(node))
    }
  }
}
