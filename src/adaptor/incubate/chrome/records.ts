import { createBaseNode, BaseNodeMap } from '@engine/model/base'
import { createChromeNode } from '@engine/model/chrome'

export const seedNodes: BaseNodeMap = {
  client: createBaseNode('client')
    .withData({
      icon: '',
      title: 'LoreWeaver',
      version: process.env.npm_package_version,
      name: process.env.npm_package_name
    })
    .build(),
  weaver: createChromeNode('weaver')
    .withTitle('Weaver')
    .withIcon('󰋘')
    .withMenuVisibility(true)
    .withData({
      submitTurn: {
        tttSynthesizer: 'pi-ai-synthesis:incubate:openrouter-free'
      },
      context: {
        icon: '󰛡',
        title: 'Context',
        subTitle: 'The Precursor',
        prefixes: ['weave:instructions', 'weave:char', 'weave:summary', 'weave:scenario']
      },
      tapestry: {
        icon: '󰛡',
        title: 'Tapestry',
        subTitle: 'The Weave',
        prefixes: ['weave:turn']
      },
      accounting: {
        icon: '󰛡',
        title: 'Accounting',
        subTitle: 'The Causality',
        prefixes: ['weave:engine:result']
      }
    })
    .build(),
  keeper: createChromeNode('keeper')
    .withTitle('Keeper')
    .withIcon('󰋘')
    .withMenuVisibility(true)
    .build(),
  settings: createChromeNode('settings')
    .withTitle('Settings')
    .withIcon('󰒓')
    .withMenuVisibility(true)
    .build()
}
