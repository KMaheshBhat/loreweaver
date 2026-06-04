import { Context, getModels, getProviders, KnownProvider, stream } from '@earendil-works/pi-ai'
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
    const rawProvider = (options?.provider as string) || 'openrouter'
    if (!isValidKnownProvider(rawProvider)) {
      throw new Error(`Unknown provider: ${rawProvider}`)
    }
    const provider = rawProvider as KnownProvider
    const rawModelId = (options?.modelId as string) || 'openrouter/free'
    const model = getModels(provider).find((model) => model.id === rawModelId)
    if (!model) {
      throw new Error(`Unknown model: ${rawModelId} for provider: ${provider}`)
    }
    console.log(`PiAiSynthesisProvider: model`, model)

    const piContext: Context = {
      systemPrompt:
        (intent.options?.systemInstructoins as string) || 'You are a helpful assistant.',
      messages: [
        {
          role: 'user',
          content: (intent.options?.userPrompt as string) || 'Continue the story.',
          timestamp: Date.now()
        }
      ]
    }
    console.log(`PiAiSynthesisProvider: piContext`, piContext)
    // Create a streaming response
    const s = stream(model, piContext)

    try {
      for await (const event of s) {
        // Convert pi-ai event to TextSynthesisChunk
        switch (event.type) {
          case 'text_delta':
            yield {
              delta: event.delta,
              meta: {
                type: 'text_delta',
                model: rawModelId
              }
            }
            break

          case 'thinking_delta':
            yield {
              delta: event.delta,
              meta: {
                type: 'thinking_delta',
                model: rawModelId
              }
            }
            break

          case 'done':
            yield {
              meta: {
                type: 'done',
                reason: event.reason,
                model: rawModelId,
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
                model: rawModelId
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
          model: rawModelId
        }
      }
    }
  }
}

function isValidKnownProvider(provider: string): provider is KnownProvider {
  return (getProviders() as string[]).includes(provider)
}
