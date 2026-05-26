// src/main/ledger.ts
import { createGraphNode } from '@engine/logic/base'
import { createChromeNode, querySidebarNodes } from '@engine/logic/chrome'
import { GraphNode, GraphNodeMap } from '@engine/types/base'
import { ChromeNode } from '@engine/types/chrome'
import { ipcMain } from 'electron'

const centralLedger: GraphNodeMap = {
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
    .build(),
  weaveInstructions: createGraphNode('weave:instructions')
    .withData({
      group: 'weave',
      title: 'System Instructions',
      content: 'You are an expert story teller.  Continue the story given the following details.'
    })
    .build(),
  character1: createGraphNode('weave:char:egg')
    .withData({
      group: 'weave',
      title: 'Aegon Targaryen',
      isUser: true,
      content:
        'Name: Aegon "Egg" Targaryen\nTitle: The Errantly Traveling Prince / The Uncrowned Dragon\nOrigins: The Red Keep, King\'s Landing (Fourth son of Prince Maekar Targaryen)\nAliases: Egg (childhood moniker), The Unlikely\nPrimary Weapon: His razor-sharp tongue, royal signet ring, and the sheer political leverage of his bloodline.'
    })
    .build(),
  character2: createGraphNode('weave:char:dunk')
    .withData({
      group: 'weave',
      title: 'Ser Duncan',
      isUser: true,
      content:
        'Name: Ser Duncan "Dunk" the Tall\nTitle: The Hedge Knight\nOrigins: Flea Bottom, King\'s Landing (Former orphan)\nAliases: Dunk the Lunk, Thick as a Castle Wall\nPrimary Weapon: A broadsword, a heavy shield, and his imposing physical stature.'
    })
    .build(),
  summary1: createGraphNode('weave:summary:1')
    .withData({
      group: 'weave',
      title: 'The Ashford Meadow Tourney',
      isUser: true,
      content:
        "Dunk is a newly anointed hedge knight traveling alone until he reluctantly takes on Egg—a disguised, runaway Targaryen prince—as his squire. When Dunk strikes a royal prince to protect a helpless puppeteer, his life is forfeit until Egg reveals his hidden identity and triggers a legendary Trial of Seven combat. Though Dunk survives the brutal trial, the king's heir is tragically slain, prompting Egg's father to let the boy continue traveling incognito with Dunk to learn how to be a regular citizen before he ever learns how to be a king."
    })
    .build(),
  summary2: createGraphNode('weave:summary:2')
    .withData({
      group: 'weave',
      title: 'The Whitewalls Conspiracy',
      isUser: true,
      content:
        "Looking for work, the duo arrives at Whitewalls castle for what is advertised as a peaceful wedding tourney, only for Dunk to slowly realize they have walked into a hornets' nest of secret Blackfyre traitors plotting a rebellion against the crown. Egg is captured trying to use his hidden identity to stop the uprising, forcing a heavily wounded Dunk to bluff his way past bloodthirsty lords and rescue his squire before the royal army arrives to crush the treasonous plot. The pair narrowly slips away into the countryside before the chaos can expose them, leaving them paranoid, exhausted, and desperately trying to keep a lower profile at any local inn."
    })
    .build(),
  scenario: createGraphNode('weave:scenario')
    .withData({
      group: 'weave',
      title: 'A Dusty Crossroads Inn',
      content:
        '## The Scenario: A Dusty Crossroads Inn\nSer Duncan the Tall stands frozen in a crowded tavern yard, his massive frame blocking the doorway as a group of hostile, drunk local guards close in around him. Egg, a bald kid in muddy boots, steps out from behind Dunk\'s massive legs, crossing his arms and boldly flashing a heavy gold signet ring engraved with a three-headed dragon. The tavern falls completely silent as the guards instantly drop to their knees in terror. Dunk lets out a heavy sigh, rubs his temples, and mutters, "Egg, you little lunk, we were supposed to be keeping a low profile."'
    })
    .build(),
  turn75: createGraphNode('weave:turn:75')
    .withData({
      group: 'weave',
      title: 'Turn #75',
      content: 'The narrative begins to unfold...',
      timestamp: 1774432800000
    })
    .build(),
  result75_1: createGraphNode('engine:result:75-1')
    .withData({
      group: 'weave',
      title: 'Result #75-1',
      kind: 'causality',
      metrics: {
        promptTokens: 1420,
        completionTokens: 312,
        inferenceTimeMs: 840
      },
      content:
        'SUCCESS: Ledger synchronization committed. State delta evaluated clean against schema verification rules.'
    })
    .withEdge({
      kind: 'causality-target',
      toNodeId: 'weave:turn:75',
      data: {}
    })
    .build(),
  turn76: createGraphNode('weave:turn:76')
    .withData({
      group: 'weave',
      title: 'Turn #76',
      content: 'Tension rises as events escalate.',
      timestamp: 1774432860000
    })
    .build(),
  result76_1: createGraphNode('engine:result:76-1')
    .withData({
      group: 'weave',
      title: 'Result #76-1',
      kind: 'causality',
      metrics: {
        promptTokens: 1850,
        completionTokens: 420,
        inferenceTimeMs: 1100
      },
      content:
        'SUCCESS: Context window shifted. Eviction pipeline cleared 2 stale beta-tier transient nodes.'
    })
    .withEdge({
      kind: 'causality-target',
      toNodeId: 'weave:turn:76',
      data: {}
    })
    .build(),
  result76_2: createGraphNode('engine:result:76-2')
    .withData({
      group: 'weave',
      title: 'Result #76-2',
      kind: 'introspection',
      metrics: {
        criticPromptTokens: 440,
        criticCompletionTokens: 5,
        verdict: 'CLEAN'
      },
      content:
        'VALIDATION: David-model checked prose boundaries. Zero conversational handshakes or clichés discovered.'
    })
    .withEdge({
      kind: 'introspection-target',
      toNodeId: 'weave:turn:76',
      data: {}
    })
    .build(),
  turn77: createGraphNode('weave:turn:77')
    .withData({
      group: 'weave',
      title: 'Turn #77',
      content: "Anthar's gaze lingers on the ledger layout...",
      timestamp: 1774432920000
    })
    .build(),
  result77_1: createGraphNode('engine:result:77-1')
    .withData({
      group: 'weave',
      title: 'Result #77-1',
      kind: 'causality',
      metrics: {
        promptTokens: 2100,
        completionTokens: 18,
        inferenceTimeMs: 220
      },
      content:
        'BEEP! TRY AGAIN! Introspection loop intercepted a conversational handshake cliche ("Your move"). Re-rolling inference execution branch.'
    })
    .withEdge({
      kind: 'introspection-target',
      toNodeId: 'weave:turn:77',
      data: {}
    })
    .build()
}

/*
// 1. The central in-memory ledger (State)
const centralLedger: GraphNodeMap = {
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
    .build(),
  weaveInstructions: createGraphNode('weave:instructions')
    .withData({
      group: 'weave',
      title: 'System Instructions',
      content: 'You are an expert story teller.  Continue the story given the following details.'
    })
    .build(),
  character1: createGraphNode('weave:char:egg')
    .withData({
      group: 'weave',
      title: 'Aegon Targaryen',
      isUser: true,
      content:
        'Name: Aegon "Egg" Targaryen\nTitle: The Errantly Traveling Prince / The Uncrowned Dragon\nOrigins: The Red Keep, King\'s Landing (Fourth son of Prince Maekar Targaryen)\nAliases: Egg (childhood moniker), The Unlikely\nPrimary Weapon: His razor-sharp tongue, royal signet ring, and the sheer political leverage of his bloodline.'
    })
    .build(),
  character2: createGraphNode('weave:char:dunk')
    .withData({
      group: 'weave',
      title: 'Ser Duncan',
      isUser: true,
      content:
        'Name: Ser Duncan "Dunk" the Tall\nTitle: The Hedge Knight\nOrigins: Flea Bottom, King\'s Landing (Former orphan)\nAliases: Dunk the Lunk, Thick as a Castle Wall\nPrimary Weapon: A broadsword, a heavy shield, and his imposing physical stature.'
    })
    .build(),
  summary1: createGraphNode('weave:summary:1')
    .withData({
      group: 'weave',
      title: 'The Ashford Meadow Tourney',
      isUser: true,
      content:
        "Dunk is a newly anointed hedge knight traveling alone until he reluctantly takes on Egg—a disguised, runaway Targaryen prince—as his squire. When Dunk strikes a royal prince to protect a helpless puppeteer, his life is forfeit until Egg reveals his hidden identity and triggers a legendary Trial of Seven combat. Though Dunk survives the brutal trial, the king's heir is tragically slain, prompting Egg's father to let the boy continue traveling incognito with Dunk to learn how to be a regular citizen before he ever learns how to be a king."
    })
    .build(),
  summary2: createGraphNode('weave:summary:2')
    .withData({
      group: 'weave',
      title: 'The Whitewalls Conspiracy',
      isUser: true,
      content:
        "Looking for work, the duo arrives at Whitewalls castle for what is advertised as a peaceful wedding tourney, only for Dunk to slowly realize they have walked into a hornets' nest of secret Blackfyre traitors plotting a rebellion against the crown. Egg is captured trying to use his hidden identity to stop the uprising, forcing a heavily wounded Dunk to bluff his way past bloodthirsty lords and rescue his squire before the royal army arrives to crush the treasonous plot. The pair narrowly slips away into the countryside before the chaos can expose them, leaving them paranoid, exhausted, and desperately trying to keep a lower profile at any local inn."
    })
    .build(),
  scenario: createGraphNode('weave:scenario')
    .withData({
      group: 'weave',
      title: 'A Dusty Crossroads Inn',
      content:
        '## The Scenario: A Dusty Crossroads Inn\nSer Duncan the Tall stands frozen in a crowded tavern yard, his massive frame blocking the doorway as a group of hostile, drunk local guards close in around him. Egg, a bald kid in muddy boots, steps out from behind Dunk\'s massive legs, crossing his arms and boldly flashing a heavy gold signet ring engraved with a three-headed dragon. The tavern falls completely silent as the guards instantly drop to their knees in terror. Dunk lets out a heavy sigh, rubs his temples, and mutters, "Egg, you little lunk, we were supposed to be keeping a low profile."'
    })
    .build(),
  turn75: createGraphNode('weave:turn:75')
    .withData({
      group: 'weave',
      title: 'Turn #75',
      content: 'The narrative begins to unfold...',
      timestamp: 1774432800000
    })
    .build(),
  result75_1: createGraphNode('engine:result:75-1')
    .withData({
      group: 'weave',
      title: 'Result #75-1',
      kind: 'causality',
      targetTurn: 'weave:turn:75',
      metrics: {
        promptTokens: 1420,
        completionTokens: 312,
        inferenceTimeMs: 840
      },
      content:
        'SUCCESS: Ledger synchronization committed. State delta evaluated clean against schema verification rules.'
    })
    .build(),
  turn76: createGraphNode('weave:turn:76')
    .withData({
      group: 'weave',
      title: 'Turn #76',
      content: 'Tension rises as events escalate.',
      timestamp: 1774432860000
    })
    .build(),
  result76_1: createGraphNode('engine:result:76-1')
    .withData({
      group: 'weave',
      title: 'Result #76-1',
      kind: 'causality',
      targetTurn: 'weave:turn:76',
      metrics: {
        promptTokens: 1850,
        completionTokens: 420,
        inferenceTimeMs: 1100
      },
      content:
        'SUCCESS: Context window shifted. Eviction pipeline cleared 2 stale beta-tier transient nodes.'
    })
    .build(),
  result76_2: createGraphNode('engine:result:76-2')
    .withData({
      group: 'weave',
      title: 'Result #76-2',
      kind: 'introspection',
      targetTurn: 'weave:turn:76',
      metrics: {
        criticPromptTokens: 440,
        criticCompletionTokens: 5,
        verdict: 'CLEAN'
      },
      content:
        'VALIDATION: David-model checked prose boundaries. Zero conversational handshakes or clichés discovered.'
    })
    .build(),
  turn77: createGraphNode('weave:turn:77')
    .withData({
      group: 'weave',
      title: 'Turn #77',
      content: "Anthar's gaze lingers on the ledger layout...",
      timestamp: 1774432920000
    })
    .build(),
  result77_1: createGraphNode('engine:result:77-1')
    .withData({
      group: 'weave',
      title: 'Result #77-1',
      kind: 'causality',
      targetTurn: 'weave:turn:77',
      metrics: {
        promptTokens: 2100,
        completionTokens: 18,
        inferenceTimeMs: 220
      },
      content:
        'BEEP! TRY AGAIN! Introspection loop intercepted a conversational handshake cliche ("Your move"). Re-rolling inference execution branch.'
    })
    .withEdge({
      kind: 'introspection-target',
      toNodeId: 'weave:turn:77',
      data: {}
    })
    .build()
}
*/

export function setupHandlers(): void {
  ipcMain.handle('client:node', async (): Promise<GraphNode> => {
    return centralLedger.client
  })
  ipcMain.handle('chrome:nodes:sidebar', async (): Promise<ChromeNode[]> => {
    return querySidebarNodes(centralLedger)
  })
  ipcMain.handle('weaver:nodes', async (): Promise<GraphNode[]> => {
    return Object.values(centralLedger).filter((node) => node.data.group === 'weave')
  })
}
