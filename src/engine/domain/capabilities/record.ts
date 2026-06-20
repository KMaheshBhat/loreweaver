import { Payload, PayloadFlow, PayloadAccessor, GenericConstructor } from '@engine/domain/hami'
import { RecordIntent, RecordProvider, RecordResult } from '@engine/port/record'
import { Intent } from '@engine/model/hami'

/**
 * The Record Capability Contract.
 * Declares the factory for wiring storage providers into the Flow Router.
 */
export interface RecordCapability {
  createRecordFlow(
    provider: RecordProvider,
    targetIntents: string[],
    options: { id: string }
  ): PayloadFlow
}

/**
 * The Record Capability Mixin.
 * Clacks the "System of Record" gears into the Central State Ledger.
 */
export function WithRecordStore<TBase extends GenericConstructor<Payload>>(
  Base: TBase
): TBase & GenericConstructor<RecordCapability> {
  return class extends Base {
    // TS Requirement: Standard mixin constructor signature
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    /**
     * Factory: Wraps a RecordProvider (JSONL, SQLite, etc.) into a PayloadFlow.
     * Implements the "Diagnostic Bouncer" and polymorphic routing.
     */
    public createRecordFlow(
      provider: RecordProvider,
      targetIntents: string[],
      options: { id: string }
    ): PayloadFlow {
      return {
        id: `flow:sor:${provider.kind}:${options.id}`,
        kind: 'record',
        supportedIntents: targetIntents,
        execute: async (accessor: PayloadAccessor, intent: Intent): Promise<void> => {
          const recordIntent = intent as RecordIntent

          // 1. The Synchronous Diagnostic Bouncer: Validate feasibility before I/O
          if (!provider.canHandle(recordIntent)) {
            console.warn(
              `[SOR Bouncer]: Provider '${provider.kind}' cannot handle intent kind '${recordIntent.kind}' with current params.`
            )
            // Ideally, emit an 'engine:result' node for Column 5 here
            return
          }

          console.log(
            `Loom: SOR Executing [${recordIntent.kind}] on collection [${recordIntent.options.collection}]...`
          )

          // 2. Polymorphic Routing based on Intent Kind
          const result: RecordResult = await provider.execute(recordIntent)

          switch (recordIntent.kind) {
            case 'record:hydrate':
              // Result is a BaseNodeMap; Reconcile/Merge into the God Object
              if (result) {
                Object.values(result).forEach((node) => accessor.addNode(node))
              }
              break

            case 'record:commit':
              // Transactional flush to disk complete; usually returns void
              break

            case 'record:discover':
            case 'record:index':
              if (recordIntent.options.targetNodeId && recordIntent.options.targetDataKey) {
                accessor.updateNode(
                  recordIntent.options.targetNodeId as string,
                  { [recordIntent.options.targetDataKey as string]: result },
                  { recordState: 'committed' }
                )
              }
              break
          }
        }
      }
    }
  }
}
