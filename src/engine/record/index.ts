import { RecordFlow } from './component'
import {
  kindRecordFlowBase,
  kindRecordIntentCommit,
  kindRecordIntentDiscover,
  kindRecordIntentHydrate,
  kindRecordIntentIndex
} from './model'

export const record = {
  flowKindBase: kindRecordFlowBase,
  flow: RecordFlow,
  intentKinds: {
    discover: kindRecordIntentDiscover,
    hydrate: kindRecordIntentHydrate,
    commit: kindRecordIntentCommit,
    index: kindRecordIntentIndex
  },
  providers: {
    // cannot add fs store because it needs a constructor
    // this indicates a need for a Component Life-Cycle
  }
}
