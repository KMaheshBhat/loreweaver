import { MintFlow } from './flow'
import { kindMintFlowBase, kindMintIntent, mintIntent } from './model'

import { ChronoMintProvider } from './provider/chrono'

export const mint = {
  flowKindBase: kindMintFlowBase,
  flow: MintFlow,
  intentKind: kindMintIntent,
  intent: mintIntent,
  providers: {
    chrono: ChronoMintProvider
  }
}
