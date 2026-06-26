import { ChromeIncubate } from '@engine/chrome'
import { GrittyLowFantasyIncubate } from '@engine/gritty-low-fantasy'
import { HighMagicAcademyIncubate } from '@engine/high-magic-academy'
import { WeaverIncubate } from '@engine/weaver'
import { Payload } from '@hami-frameworx/runtime'
import { MintFlow } from './mint/component'
import { ChronoIDMintProvider } from './mint/provider/chrono'
import { RecordFlow } from './record/component'
import { FSStoreIncubate } from './record/fs-store-provider'
import { SynthesisFlow } from './synthesis/component'
import { PiAiSynthesisProvider } from './synthesis/pi-ai-synthesis-provider'
import { BaseNode } from './model'

const loreChoice = 1 // 0 - high-magic-academy 1 - grim-low-fantasy

export class Ledger extends Payload {
  public override getNode(id: string): BaseNode | undefined {
    return super.getNode(id) as BaseNode
  }
  public getGraphNodes(): BaseNode[] {
    return Object.values(this.getNodes()) as BaseNode[]
  }
}

export function bootstrap(): Ledger {
  const ledger = new Ledger()
  ledger.addFlow(new ChromeIncubate())
  const glf = new GrittyLowFantasyIncubate()
  const hma = new HighMagicAcademyIncubate()
  loreChoice % 2 == 1 ? ledger.addFlow(glf) : ledger.addFlow(hma)
  const fss = new FSStoreIncubate({ rootDirectory: '.' })
  ledger.addFlow(new MintFlow(new ChronoIDMintProvider(), [], { id: 'id-mint' }))
  ledger.addFlow(new RecordFlow(fss, [], { id: 'fs-record' }))
  ledger.addFlow(new WeaverIncubate())
  const openRouterFree = {
    id: 'openrouter-free',
    options: {
      provider: 'openrouter',
      modelId: 'openrouter/free'
    }
  }
  const llamaCpp = {
    id: 'llama.cpp',
    options: {
      provider: 'llama.cpp',
      modelId: '',
      temperature: 1.0,
      top_p: 0.95,
      top_k: 20,
      min_p: 0.0,
      presence_penalty: 1.5,
      repetition_penalty: 1.0
    }
  }
  ledger.addFlow(new SynthesisFlow(new PiAiSynthesisProvider(), [], openRouterFree))
  ledger.addFlow(new SynthesisFlow(new PiAiSynthesisProvider(), [], llamaCpp))
  return ledger
}
