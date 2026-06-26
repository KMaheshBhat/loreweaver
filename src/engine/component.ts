import { Payload } from '@hami-frameworx/runtime'
import { engine } from '.'
import { BaseNode } from './model'
import { FSStoreProvider } from './record/provider/fs-store'
import { PiAiSynthesisProvider } from './synthesis/provider/pi-ai-synthesis'

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
  const c = engine.components
  ledger.addFlow(new c.chrome.flow())
  loreChoice % 2 == 1
    ? ledger.addFlow(new c.grittyLowFantasy.flow())
    : ledger.addFlow(new c.highMagicAcademy.flow())
  ledger.addFlow(
    new c.mint.flow(new c.mint.providers.chrono(), [c.mint.intentKind], { id: 'system:flow:mint' })
  )
  ledger.addFlow(
    new c.record.flow(new FSStoreProvider({ rootDirectory: '.' }), [], {
      id: 'system:flow:fs-record'
    })
  )
  ledger.addFlow(new c.weaver.flow())
  ledger.addFlow(
    new c.synthesis.flow(new PiAiSynthesisProvider(), [], {
      id: 'system:flow:synthesis:openrouter-free',
      options: {
        provider: 'openrouter',
        modelId: 'openrouter/free'
      }
    })
  )
  ledger.addFlow(
    new c.synthesis.flow(new PiAiSynthesisProvider(), [], {
      id: 'system:flow:synthesis:llama.cpp',
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
    })
  )
  return ledger
}
