import { BaseNode } from '@engine/model/base'
import { WithIdMinting } from './capabilities/mint'
import { WithSynthesisFlow } from './capabilities/synthesis'
import { applyMixins, Payload } from './hami'

const CapabilitiesBase = applyMixins(Payload, [WithIdMinting, WithSynthesisFlow])

export class Ledger extends CapabilitiesBase {
  public override getNode(id: string): BaseNode | undefined {
    return super.getNode(id) as BaseNode
  }

  public getGraphNodes(): BaseNode[] {
    return Object.values(this.getNodes()) as BaseNode[]
  }
}
