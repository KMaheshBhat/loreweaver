import { DataNode, Intent, PayloadAccessor, PayloadFlow } from '@hami-frameworx/core'
import { seedNodes } from './records'
import { kindChromeFlow } from './model'
import { kindSystemIntent } from '../model'

/**
 * The Chrome Genesis Adaptor.
 * Orchestrates the "Inking" of the application chrome into the Ledger.
 * Responsible for seeding the initial application shell nodes (Weaver, Keeper, Settings).
 */
export class ChromeFlow implements PayloadFlow {
  public readonly id = crypto.randomUUID()
  public readonly kind = kindChromeFlow
  public readonly supportedIntents = [kindSystemIntent]

  /**
   * Executes the chrome initialization workflow.
   * Seeds the ledger with application shell nodes when an 'init' intent is received.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent triggering this workflow.
   */
  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    if (intent.kind === kindSystemIntent) {
      console.log(
        'Loom Throne: Stabilizing the System Frame. Please keep your hands and feet inside the viewport...'
      )
      Object.values(seedNodes).forEach((node) => accessor.addNode(node as DataNode))
    }
  }
}
