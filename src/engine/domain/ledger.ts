import { BaseNode } from '@engine/model/base'
import { WithSynthesisFlow } from './capabilities/synthesis'
import { Payload } from './hami'

export class Ledger extends WithSynthesisFlow(Payload) {
  public override getNode(id: string): BaseNode | undefined {
    return super.getNode(id) as BaseNode
  }

  public getGraphNodes(): BaseNode[] {
    return Object.values(this.getNodes()) as BaseNode[]
  }
}
