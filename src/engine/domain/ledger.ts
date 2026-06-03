import { GraphNode } from '@engine/model/base'
import { WithSynthesisFlow } from './capabilities/synthesis'
import { Payload } from './hami'

export class Ledger extends WithSynthesisFlow(Payload) {
  public override getNode(id: string): GraphNode | undefined {
    return super.getNode(id) as GraphNode
  }

  public getGraphNodes(): GraphNode[] {
    return Object.values(this.getNodes()) as GraphNode[]
  }
}
