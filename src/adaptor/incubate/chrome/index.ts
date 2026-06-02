import { WorkflowProvider, WorkflowContext } from '@engine/port/workflow'
import { Intent } from '@engine/model/intent'
import { seedNodes } from './records'

/**
 * The Chrome Genesis Adaptor.
 * Orchestrates the "Inking" of the application chrome into the Ledger.
 * Responsible for seeding the initial application shell nodes (Weaver, Keeper, Settings).
 */
export class ChromeIncubate implements WorkflowProvider {
  public readonly id = 'chrome:incubate'

  public readonly supportedKinds = ['init']

  /**
   * Executes the chrome initialization workflow.
   * Seeds the ledger with application shell nodes when an 'init' intent is received.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent triggering this workflow.
   */
  async execute(context: WorkflowContext, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log(
        'Loom Throne: Stabilizing the System Frame. Please keep your hands and feet inside the viewport...'
      )
      Object.values(seedNodes).forEach((node) => context.addNode(node))
    }
  }
}
