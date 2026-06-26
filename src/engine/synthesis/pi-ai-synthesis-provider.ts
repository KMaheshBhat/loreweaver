import {
  AssistantMessageEventStream,
  Context,
  getModels,
  getProviders,
  KnownProvider,
  Model,
  stream
} from '@earendil-works/pi-ai'
import { BaseNode } from '@engine/model'
import { TextSynthesisChunk, TextToTextSynthesisProvider } from './synthesis'
import { Intent } from '@hami-frameworx/core'

export class PiAiSynthesisProvider implements TextToTextSynthesisProvider {
  public readonly kind = 'pi-ai-synthesis:incubate'

  async *generateStream(
    intent: Intent,
    _context: BaseNode[],
    options?: Record<string, unknown>
  ): AsyncIterable<TextSynthesisChunk> {
    const piContext: Context = {
      systemPrompt:
        (intent.options?.systemInstructions as string) || 'You are a helpful assistant.',
      messages: [
        {
          role: 'user',
          content: (intent.options?.userPrompt as string) || 'Continue the story.',
          timestamp: Date.now()
        }
      ]
    }
    let s: AssistantMessageEventStream
    const {
      provider = 'openrouter',
      modelId = 'local-model',
      baseUrl = 'http://127.0.0.1:8033/v1',
      ...samplingOptions
    } = options || {}
    const rawProvider = provider as string
    const rawModelId = modelId as string // Dummy ID for llama.cpp
    // TODO capture remaining options as samplingOptions

    if (rawProvider == 'llama.cpp') {
      const model = {
        id: rawModelId,
        name: 'Local Llama.cpp',
        api: 'openai-completions', // SDK uses this for OAI-compatible backends [4, 5]
        provider: 'llama.cpp',
        baseUrl: baseUrl,
        reasoning: false, // Local llama-server usually doesn't emit 'thinking' blocks yet
        input: ['text'],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 65536, // Match your server config [6]
        maxTokens: 4096
      } as Model<'openai-completions'>
      console.log(`PiAiSynthesisProvider: model`, model)
      s = stream(model, piContext, {
        apiKey: 'dummy',
        ...samplingOptions
      })
    } else {
      if (!isValidKnownProvider(rawProvider)) {
        throw new Error(`Unknown provider: ${rawProvider}`)
      }
      const provider = rawProvider as KnownProvider
      const model = getModels(provider).find((model) => model.id === rawModelId)
      if (!model) {
        throw new Error(`Unknown model: ${rawModelId} for provider: ${provider}`)
      }
      console.log(`PiAiSynthesisProvider: model`, model)
      s = stream(model, piContext, samplingOptions)
    }

    // Create a streaming response

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
