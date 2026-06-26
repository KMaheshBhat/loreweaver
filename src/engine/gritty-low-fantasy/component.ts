import { kindSystemIntent } from '@engine/model'
import { kindGrittyLowFantasyFlow } from './model'
import { seedNodes } from './records'
import { Intent, PayloadAccessor, PayloadFlow } from '@hami-frameworx/core'

/**
 * The Gritty Low Fantasy Genesis Adaptor.
 * Orchestrates the "Inking" of the gritty low fantasy world into the Ledger.
 * Responsible for seeding the narrative state, characters, and scenario nodes.
 */
export class GrittyLowFantasyFlow implements PayloadFlow {
  public readonly id = crypto.randomUUID()
  public readonly kind = kindGrittyLowFantasyFlow
  public readonly supportedIntents = [kindSystemIntent]

  /**
   * Executes the gritty low fantasy initialization workflow.
   * Seeds the ledger with narrative nodes when an 'init' intent is received.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent triggering this workflow.
   */
  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    if (intent.kind === kindSystemIntent) {
      console.log(
        'Sovereign Seal: Inking a world of grit, mud, and royals who think a hooded cloak counts as a disguise...'
      )
      Object.values(seedNodes).forEach((node) => accessor.addNode(node))
    }
  }
}
