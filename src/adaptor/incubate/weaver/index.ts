import { Intent } from '@engine/model/hami'
import { PayloadAccessor, PayloadFlow } from '@engine/domain/hami'
import { createBaseNode } from '@engine/model/base'

/**
 * The Weaver Operational Adaptor.
 * Handles active narrative turn submissions and orchestrates
 * the transition from proposed to resolving states.
 */
export class WeaverIncubate implements PayloadFlow {
  public readonly id = 'weaver:incubate'

  public readonly kind = 'workflow'

  public readonly supportedIntents = ['submit-turn']

  /**
   * Executes the narrative turn submission workflow.
   * Processes all nodes carried by the intent and adds them to the ledger.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent containing the narrative turn nodes to process.
   */
  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    const allNodes = accessor.getNodes()
    const sidebarNodes = Object.values(allNodes).filter((node) =>
      node.kind.startsWith('loreweaver:chrome')
    )
    const weaverConfig = sidebarNodes.find((node) => node.id === 'weaver')
    if (intent.kind === 'submit-turn') {
      const tttSynthesizer = weaverConfig?.data?.submitTurn?.['tttSynthesizer']
      if (!tttSynthesizer) {
        throw new Error('tttSynthesizer not configured')
      }
      const weaveNodes = Object.values(allNodes).filter((node) => node.data.group === 'weave')
      console.log(
        'Weaver: weaveNodes.id',
        weaveNodes.map((node) => node.id)
      )
      const siNodes = weaveNodes
        .filter((node) => node.id.startsWith('weave:instructions'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const charNodes = weaveNodes
        .filter((node) => node.id.startsWith('weave:char'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const summaryNodes = weaveNodes
        .filter((node) => node.id.startsWith('weave:summary'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const scenarioNodes = weaveNodes
        .filter((node) => node.id.startsWith('weave:scenario'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const turnNodes = weaveNodes
        .filter((node) => node.id.startsWith('weave:turn'))
        .sort((a, b) => a.id.localeCompare(b.id))
      // Loop through all nodes carried by the intent (Proposed + Updates)
      intent.nodes.forEach((node) => {
        accessor.addNode(node)
      })
      const turnId = `synth:${Date.now()}`
      const proposedNode = createBaseNode(`weave:turn:${turnId}`)
        .withData({
          group: 'weave',
          title: `Turn ${turnId}`,
          content: '',
          timestamp: Date.now()
        })
        .withMeta({
          recordState: 'draft',
          engagementState: 'active'
        })
        .build()
      accessor.addNode(proposedNode)
      let systemInstructions = ''
      let userPrompt = ''
      for (const node of siNodes) {
        systemInstructions += node.data.content + '\n'
      }
      for (const node of charNodes) {
        userPrompt += `## Character - ${node.data?.title}\n` + node.data?.content + '\n'
      }
      for (const node of summaryNodes) {
        userPrompt += `## Previously - ${node.data?.title}\n` + node.data?.content + '\n'
      }
      for (const node of scenarioNodes) {
        userPrompt += `## Scenario - ${node.data?.title}\n` + node.data?.content + '\n'
      }
      for (const node of turnNodes) {
        userPrompt += `## ${node.data?.title}\n` + node.data?.content + '\n'
      }
      userPrompt += `## ${proposedNode.data?.title}\n` + '\n[prose]\n'
      // TODO hardcoding for now - need to do character turn management
      const currentChar = charNodes[0]
      userPrompt += `\n---\nProvide ${currentChar.data?.title} roleplay, not more than two or three small paragraphs. Keep in third person. No meta commentary.  Just the prose which can replace [prose] above.`
      const synthIntent: Intent = {
        id: `synth:${Date.now()}`,
        kind: 'synthesis',
        nodes: [],
        options: {
          systemInstructions,
          userPrompt
        }
      }

      try {
        const tttSynthesizerFlowId = `flow:synthesis:${tttSynthesizer}`
        await accessor.runFlow(synthIntent, tttSynthesizerFlowId, {
          proposedNodeId: proposedNode.id
        })
      } catch (e) {
        console.error(`Weaver: Failed to execute TTT synthesis flow:`, e)
      }

      console.log(`Weaver: Ingested ${intent.nodes.length} nodes for [Go! Go! Go!] sequence.`)
    }
  }
}
