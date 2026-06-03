import { Intent } from '@engine/model/hami'
import { seedNodes } from './records'
import { PayloadAccessor, PayloadFlow } from '@engine/domain/hami'

/**
 * The Chrome Genesis Adaptor.
 * Orchestrates the "Inking" of the application chrome into the Ledger.
 * Responsible for seeding the initial application shell nodes (Weaver, Keeper, Settings).
 */
export class ChromeIncubate implements PayloadFlow {
  public readonly id = 'chrome:incubate'

  public readonly kind = 'records'

  public readonly supportedIntents = ['init']

  /**
   * Executes the chrome initialization workflow.
   * Seeds the ledger with application shell nodes when an 'init' intent is received.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent triggering this workflow.
   */
  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log(
        'Loom Throne: Stabilizing the System Frame. Please keep your hands and feet inside the viewport...'
      )
      Object.values(seedNodes).forEach((node) => accessor.addNode(node))
    }
  }
}
