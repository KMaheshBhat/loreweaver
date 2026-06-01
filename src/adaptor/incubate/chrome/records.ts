import { createGraphNode, GraphNodeMap } from '@engine/model/base'
import { createChromeNode } from '@engine/model/chrome'

export const seedNodes: GraphNodeMap = {
  client: createGraphNode('client')
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
        prefixes: ['engine:result']
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
