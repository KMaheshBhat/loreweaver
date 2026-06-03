import { Context, getModel, Message, stream } from '@earendil-works/pi-ai'
import { BaseNode } from '@engine/model/base'
import { Intent } from '@engine/model/hami'
import { TextSynthesisChunk, TextToTextSynthesisProvider } from '@engine/port/synthesis'

export class PiAiSynthesisProvider implements TextToTextSynthesisProvider {
  public readonly id = 'pi-ai-synthesis:incubate'

  async *generateStream(
    intent: Intent,
    _context: BaseNode[],
    options?: Record<string, unknown>
  ): AsyncIterable<TextSynthesisChunk> {
    const modelId = 'openrouter/free'
    const piModel = getModel('openrouter', modelId)
    console.log(`PiAiSynthesisProvider: model`, piModel)

    // Convert GraphNode[] context to pi-ai Context format
    const piContext: Context = {
      systemPrompt: (options?.systemPrompt as string) || 'You are a helpful assistant.',
      messages: intent.nodes.map((node) => {
        const message: Message = {
          role: 'user',
          content: node.data.content as string,
          timestamp: Date.now()
        }
        if (node.data.timestamp) {
          message.timestamp = node.data.timestamp as number
        }
        return message
      })
    }
    // Create a streaming response
    const s = stream(piModel, piContext)

    try {
      for await (const event of s) {
        // Convert pi-ai event to TextSynthesisChunk
        switch (event.type) {
          case 'text_delta':
            yield {
              delta: event.delta,
              meta: {
                type: 'text_delta',
                model: modelId
              }
            }
            break

          case 'thinking_delta':
            yield {
              delta: event.delta,
              meta: {
                type: 'thinking_delta',
                model: modelId
              }
            }
            break

          case 'done':
            yield {
              meta: {
                type: 'done',
                reason: event.reason,
                model: modelId,
                ...(event.message?.usage && {
                  usage: event.message.usage
                })
              }
            }
            break

          case 'error':
            yield {
              meta: {
                type: 'error',
                error: event.error,
                model: modelId
              }
            }
            break
        }
      }
    } catch (error) {
      yield {
        meta: {
          type: 'error',
          error: error instanceof Error ? error.message : String(error),
          model: modelId
        }
      }
    }
  }
}
