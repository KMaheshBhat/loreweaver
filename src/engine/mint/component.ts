import { MintIntent, MintOptions, MintProvider } from '@engine/mint/mint'
import { Intent, PayloadAccessor, PayloadFlow } from '@hami-frameworx/core'

export class MintFlow implements PayloadFlow {
  public readonly id: string
  public readonly kind = 'mint'
  public readonly supportedIntents: string[]
  private provider: MintProvider

  constructor(provider: MintProvider, targetIntents: string[], options: { id: string }) {
    this.id = `flow:mint:${provider.kind}:${options.id}`
    this.supportedIntents = targetIntents
    this.provider = provider
  }

  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    const mintIntent = intent as MintIntent
    const { targetNodeId, targetDataKey, count = 1 } = mintIntent.options as MintOptions
    console.log(`Loom: Minting ${count} IDs for [${targetNodeId}.${targetDataKey}]...`)
    const ids = await this.provider.mintIDs(mintIntent, intent.options)
    accessor.updateNode(
      targetNodeId,
      { [targetDataKey]: ids.length === 1 ? ids : ids },
      { recordState: 'committed' },
      []
    )
  }
}
