import { Payload, PayloadFlow, PayloadAccessor } from '@engine/domain/hami'
import { MintIntent, MintOptions, MintProvider } from '@engine/port/mint'
import { Intent } from '@engine/model/hami'
import { GConstructor } from './capability'

export interface IDMintCapability {
  createIdMintingFlow(
    provider: MintProvider,
    targetIntents: string[],
    options: { id: string }
  ): PayloadFlow
  getMintedId(key: string): string | undefined
}

export function WithIdMinting<TBase extends GConstructor<Payload>>(
  Base: TBase
): TBase & GConstructor<IDMintCapability> {
  return class extends Base {
    private nodeId: string | undefined
    // TS Requirement: A mixin class must have this specific constructor signature
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
      this.nodeId = undefined
    }

    /**
     * Factory: Wraps the provider into a 'minting' kind flow.
     * Results are stored in the 'sys:minted-ids' node under the specified key.
     */
    public createIdMintingFlow(
      provider: MintProvider,
      targetIntents: string[],
      options: { id: string }
    ): PayloadFlow {
      this.nodeId = `flow:mint:${provider.kind}:${options.id}`
      return {
        id: this.nodeId,
        kind: 'mint',
        supportedIntents: targetIntents,
        execute: async (accessor: PayloadAccessor, intent: Intent): Promise<void> => {
          const mintIntent = intent as MintIntent
          const { targetNodeId, targetDataKey, count = 1 } = mintIntent.options as MintOptions
          console.log(`Loom: Minting ${count} IDs for [${targetNodeId}.${targetDataKey}]...`)
          const ids = await provider.mintIDs(mintIntent, intent.options)
          accessor.updateNode(
            targetNodeId,
            { [targetDataKey]: ids.length === 1 ? ids : ids },
            { recordState: 'committed' }
          )
        }
      }
    }

    /**
     * Helper: Retrieves the last minted ID for a given key from the system node.
     */
    public getMintedId(key: string): string | undefined {
      if (!this.nodeId) return undefined
      const node = this.getNode(this.nodeId)
      return node?.data[key] as string | undefined
    }
  }
}
