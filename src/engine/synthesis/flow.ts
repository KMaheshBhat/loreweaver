import { BaseNode } from '@engine/model'
import { Intent, PayloadAccessor, PayloadFlow } from '@hami-frameworx/core'
import { kindSynthesisFlowBase, TextToTextSynthesisProvider } from './model'

export interface SynthesisFlowOptions {
  id: string
  options?: Record<string, unknown>
}

export class SynthesisFlow implements PayloadFlow {
  public readonly id: string
  public readonly kind: string
  public readonly supportedIntents: string[]
  private provider: TextToTextSynthesisProvider
  private baseOptions: Record<string, unknown>

  constructor(
    provider: TextToTextSynthesisProvider,
    targetIntents: string[],
    options: SynthesisFlowOptions
  ) {
    this.id = options.id
    this.kind = `${kindSynthesisFlowBase}:${provider.kind}`
    this.supportedIntents = targetIntents
    this.provider = provider
    this.baseOptions = options.options ?? {}
  }

  async execute(
    accessor: PayloadAccessor,
    intent: Intent,
    options?: Record<string, unknown>
  ): Promise<void> {
    console.log(
      `Executing synthesis flow: ${this.id}<${this.kind}> with intent ${JSON.stringify(intent)}`
    )
    // Narrowing nodes to domain GraphNodes for context
    const contextNodes = Object.values(accessor.getNodes()) as BaseNode[]

    // Identification of the target "Neo State" node
    const responseNodeId = options?.proposedNodeId as string
    if (!responseNodeId) {
      console.error('Synthesis aborted: No proposedNodeId provided in options.')
      return
    }

    const flowOptions = { ...this.baseOptions, ...options }
    const stream = this.provider.generateStream(intent, contextNodes, flowOptions)
    console.log(`Synthesis stream aligned for node [${responseNodeId}]...`)

    let accumulatedProse = ''
    let accumulatedThought = ''

    for await (const chunk of stream) {
      if (chunk.meta?.type === 'error') {
        console.error('Synthesis error:', chunk.meta)
        continue
      }

      if (chunk.delta) {
        if (chunk.meta?.type === 'thinking_delta') {
          accumulatedThought += chunk.delta
          // You can stream the thought processing to a dedicated metadata block
          accessor.updateNode(responseNodeId, { thinkContent: accumulatedThought }, {}, [])
        } else if (chunk.meta?.type === 'text_delta') {
          accumulatedProse += chunk.delta
          // Keep the main content clean and strictly character-facing
          accessor.updateNode(responseNodeId, { content: accumulatedProse }, {}, [])
        }
      }
    }

    // Finalize: Commit the final code-clean prose and permanently store the thought process
    console.log(
      `Synthesis completed for node [${responseNodeId}].\nThought: ${accumulatedThought}.\nProse: ${accumulatedProse} `
    )
    accessor.updateNode(
      responseNodeId,
      { content: accumulatedProse, thinkContent: accumulatedThought },
      {
        recordState: 'proposed'
      },
      []
    )
  }
}
