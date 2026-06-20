import { BaseNode } from '@engine/model/base'
import { IDMintCapability, WithIdMinting } from './capabilities/mint'
import { RecordCapability, WithRecordStore } from './capabilities/record'
import { SynthesisFlowCapability, WithSynthesisFlow } from './capabilities/synthesis'
import { applyMixins, GenericConstructor, Payload } from './hami'

const CapabilitiesBase = applyMixins(Payload, [
  WithIdMinting,
  WithSynthesisFlow,
  WithRecordStore
]) as unknown as GenericConstructor<
  Payload & IDMintCapability & SynthesisFlowCapability & RecordCapability
>

export class Ledger extends CapabilitiesBase {
  public override getNode(id: string): BaseNode | undefined {
    return super.getNode(id) as BaseNode
  }

  public getGraphNodes(): BaseNode[] {
    return Object.values(this.getNodes()) as BaseNode[]
  }
}
