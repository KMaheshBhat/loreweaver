import { BaseNode, createBaseNode } from '@engine/model'
import { kindRecordIntentCommit } from '@engine/record/model'
import { Intent, PayloadAccessor, PayloadFlow } from '@hami-frameworx/core'
import { engine } from '../'
import { kindWeaverFlow, kindWeaverIntentSubmitTurn } from './model'

/**
 * The Weaver Operational Adaptor.
 * Handles active narrative turn submissions and orchestrates
 * the transition from proposed to resolving states.
 */
export class WeaverFlow implements PayloadFlow {
  public readonly id = crypto.randomUUID()
  public readonly kind = kindWeaverFlow
  public readonly supportedIntents = [kindWeaverIntentSubmitTurn]

  /**
   * Executes the narrative turn submission workflow.
   * Processes all nodes carried by the intent and adds them to the ledger.
   *
   * @param context The workflow context for state mutation.
   * @param intent The intent containing the narrative turn nodes to process.
   */
  async execute(accessor: PayloadAccessor, intent: Intent): Promise<void> {
    const c = engine.components
    const allNodes = accessor.getNodes()
    const sidebarNodes = Object.values(allNodes).filter((node) =>
      node.kind.startsWith('loreweaver:chrome')
    )
    const weaverConfig = sidebarNodes.find((node) => node.id === 'weaver')
    if (intent.kind === kindWeaverIntentSubmitTurn) {
      const tttSynthesizer = weaverConfig?.data?.submitTurn?.['tttSynthesizer']
      if (!tttSynthesizer) {
        throw new Error('tttSynthesizer not configured')
      }
      const weaveNodes = Object.values(allNodes).filter((node) => {
        return String(node.data?.group).startsWith('weave')
      }) as BaseNode[]
      console.log(
        'Weaver: weaveNodes.id',
        weaveNodes.map((node) => node.id)
      )
      const siNodes = weaveNodes
        .filter((node) => node.data.group.startsWith('weave:instructions'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const charNodes = weaveNodes
        .filter((node) => node.data.group.startsWith('weave:char'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const summaryNodes = weaveNodes
        .filter((node) => node.data.group.startsWith('weave:summary'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const scenarioNodes = weaveNodes
        .filter((node) => node.data.group.startsWith('weave:scenario'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const turnNodes = weaveNodes
        .filter((node) => node.data.group.startsWith('weave:turn'))
        .sort((a, b) => a.id.localeCompare(b.id))
      const mintedNodeId = `loreweaver:submit-turn:${Date.now()}`
      accessor.addNode(createBaseNode(mintedNodeId).build())
      const idCount = intent.nodes.length + 1
      await accessor.runFlow(
        c.mint.intent({
          type: 'tsid',
          count: idCount,
          targetNodeId: mintedNodeId,
          targetDataKey: 'ids'
        })
      )
      const mintedNode = accessor.getNode(mintedNodeId)
      const ids: string[] = (mintedNode?.data?.['ids'] as string[]) || []
      if (ids.length !== idCount) {
        throw new Error(`Expected ${intent.nodes.length} ids, got ${ids.length}`)
      }
      intent.nodes.forEach((node, i) => {
        const nodeWithChronoId = createBaseNode(`${ids[i]}`)
          .withGroup('weave:turn')
          .withKind(node.kind)
          .withData({
            ...node.data,
            title: `Turn ${ids[i]}`
          })
          .withEdges(node.edges)
          .withMeta(node.meta)
          .build()
        turnNodes.push(nodeWithChronoId)
        accessor.addNode(nodeWithChronoId)
      })
      const turnId = `${ids[idCount - 1]}`
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
        console.log(`Weave: Adding system instruction ${node.id}`)
        systemInstructions += node.data.content + '\n'
      }
      for (const node of charNodes) {
        console.log(`Weave: Adding character ${node.id} - ${node.data?.title}`)
        userPrompt += `## Character - ${node.data?.title}\n` + node.data?.content + '\n'
      }
      for (const node of summaryNodes) {
        console.log(`Weave: Adding summary ${node.id} - ${node.data?.title}`)
        userPrompt += `## Previously - ${node.data?.title}\n` + node.data?.content + '\n'
      }
      for (const node of scenarioNodes) {
        console.log(`Weave: Adding scenario ${node.id} - ${node.data?.title}`)
        userPrompt += `## Scenario - ${node.data?.title}\n` + node.data?.content + '\n'
      }
      for (const node of turnNodes) {
        console.log(`Weave: Adding turn ${node.id} - ${node.data?.title}`)
        userPrompt += `## ${node.data?.title}\n` + node.data?.content + '\n'
      }
      console.log(`Weave: Adding proposed turn ${proposedNode.id} - ${proposedNode.data?.title}`)
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

      const synthDisabled = true

      if (synthDisabled) {
        try {
          await accessor.runFlow(synthIntent, tttSynthesizer, {
            proposedNodeId: proposedNode.id
          })
        } catch (e) {
          console.error(`Weaver: Failed to execute TTT synthesis flow:`, e)
        }
        console.log(`Weaver: Ingested ${intent.nodes.length} nodes for [Go! Go! Go!] sequence.`)
      }

      console.log(`Weaver: Preparing to commit ${turnNodes.length} nodes to FSStore...`)
      const commitIntent = {
        id: crypto.randomUUID(),
        kind: kindRecordIntentCommit,
        nodes: turnNodes,
        options: {
          collection: 'records'
        }
      }

      // Dispatch to the SOR Flow
      try {
        await accessor.runFlow(commitIntent, 'flow:sor:fs-store:incubate:fs-record')
        console.log('Weaver: Persistence flush complete.')
      } catch (e) {
        console.error('Weaver: Persistence failure:', e)
      }
    }
  }
}
