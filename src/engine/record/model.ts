import { DataNodeMap, Intent } from '@hami-frameworx/core'

export const kindRecordFlowBase = 'loreweaver:record:flow'
export const kindRecordIntentHydrate = 'loreweaver:record:intent:hydrate'
export const kindRecordIntentCommit = 'loreweaver:record:intent:commit'
export const kindRecordIntentIndex = 'loreweaver:record:intent:index'
export const kindRecordIntentDiscover = 'loreweaver:record:intent:discover'

/**
 * Universal Options for SoR operations.
 */
export interface RecordOptions extends Record<string, unknown> {
  collection: string
}

/**
 * Result Union: Replaces 'any' to provide deterministic return types.
 * Each intent kind now has a corresponding expected result type.
 */
export type RecordResult =
  | DataNodeMap // For record:hydrate
  | string[] // For record:discover (IDs) or record:index (status)
  | void // For record:commit

export type RecordIntent =
  | RecordHydrateIntent
  | RecordCommitIntent
  | RecordIndexIntent
  | RecordDiscoverIntent

export interface RecordHydrateIntent extends Intent {
  kind: typeof kindRecordIntentHydrate
  options: RecordOptions & { ids?: string[] }
}

export interface RecordCommitIntent extends Intent {
  kind: typeof kindRecordIntentCommit
  options: RecordOptions
}

export interface RecordIndexIntent extends Intent {
  kind: typeof kindRecordIntentIndex
  options: RecordOptions & { event: 'full-build' | 'incremental' }
}

export interface RecordDiscoverIntent extends Intent {
  kind: typeof kindRecordIntentDiscover
  options: RecordOptions & {
    // Replaced 'any' with Record to satisfy linter and maintain data-first structure
    params?: Record<string, unknown>
    traversal?: { id: string; direction: 'in' | 'out' | 'both' }
  }
}

export function isRecordIntent(intent: Intent): intent is RecordIntent {
  return (
    intent.kind === kindRecordIntentHydrate ||
    intent.kind === kindRecordIntentCommit ||
    intent.kind === kindRecordIntentIndex ||
    intent.kind === kindRecordIntentDiscover
  )
}

/**
 * The Polymorphic System of Record Port.
 */
export interface RecordProvider {
  readonly kind: string

  /**
   * The Synchronous Diagnostic Bouncer:
   * Acts as a high-speed logic gate. Because it is synchronous, the Orchestrator
   * can fail-fast during the 'Gather' phase of the tick cycle.
   */
  canHandle(intent: RecordIntent): boolean

  /**
   * The Command Router:
   * Now returns a typed RecordResult instead of 'any'.
   */
  execute(intent: RecordIntent): Promise<RecordResult>
}
