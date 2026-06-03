import { Intent } from '@engine/model/hami'
import { seedNodes } from './records'
import { PayloadAccessor, PayloadFlow } from '@engine/domain/hami'

/**
 * The High Magic Academy Genesis Adaptor.
 * Orchestrates the "Inking" of the high magic academy world into the Ledger.
 * Responsible for seeding the narrative state, characters, and scenario nodes.
 */
export class HighMagicAcademyIncubate implements PayloadFlow {
  public readonly id = 'high-magic-academy:incubate'

  public readonly kind = 'records'

  public readonly supportedIntents = ['init']

  /**
   * Executes the high magic academy initialization workflow.
   * Seeds the ledger with narrative nodes when an 'init' intent is received.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent triggering this workflow.
   */
  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    if (intent.kind === 'init') {
      console.log(
        'Arcane Vault: Lighting the lanterns. Try not to shatter any memories or unauthorized spells today...'
      )
      Object.values(seedNodes).forEach((node) => accessor.addNode(node))
    }
  }
}
