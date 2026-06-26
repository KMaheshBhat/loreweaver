import { Intent, PayloadAccessor, PayloadFlow } from '@hami-frameworx/core'
import {
  RecordIntent,
  RecordProvider,
  RecordResult,
  kindRecordIntentHydrate,
  kindRecordIntentCommit,
  kindRecordIntentIndex,
  kindRecordIntentDiscover,
  kindRecordFlowBase
} from './model'

export class RecordFlow implements PayloadFlow {
  public readonly id: string
  public readonly kind: string
  public readonly supportedIntents: string[]
  private provider: RecordProvider

  constructor(provider: RecordProvider, targetIntents: string[], options: { id: string }) {
    this.id = `${options.id}`
    this.kind = `${kindRecordFlowBase}:${provider.kind}`
    this.supportedIntents = targetIntents
    this.provider = provider
  }

  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    const recordIntent = intent as RecordIntent

    // 1. The Synchronous Diagnostic Bouncer: Validate feasibility before I/O
    if (!this.provider.canHandle(recordIntent)) {
      console.warn(
        `[SOR Bouncer]: Provider '${this.provider.kind}' cannot handle intent kind '${recordIntent.kind}' with current params.`
      )
      // Ideally, emit an 'engine:result' node for Column 5 here
      return
    }

    console.log(
      `Loom: SOR Executing [${recordIntent.kind}] on collection [${recordIntent.options.collection}]...`
    )

    // 2. Polymorphic Routing based on Intent Kind
    const result: RecordResult = await this.provider.execute(recordIntent)

    switch (recordIntent.kind) {
      case kindRecordIntentHydrate:
        // Result is a BaseNodeMap; Reconcile/Merge into the God Object
        if (result) {
          Object.values(result).forEach((node) => accessor.addNode(node))
        }
        break

      case kindRecordIntentCommit:
        // Transactional flush to disk complete; usually returns void
        break

      case kindRecordIntentDiscover:
      case kindRecordIntentIndex:
        if (recordIntent.options.targetNodeId && recordIntent.options.targetDataKey) {
          accessor.updateNode(
            recordIntent.options.targetNodeId as string,
            { [recordIntent.options.targetDataKey as string]: result },
            { recordState: 'committed' },
            []
          )
        }
        break
    }
  }
}
