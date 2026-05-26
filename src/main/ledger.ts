// src/main/ledger.ts
import { createGraphNode } from '@engine/logic/base'
import { createChromeNode, querySidebarNodes } from '@engine/logic/chrome'
import { GraphNode, GraphNodeMap } from '@engine/types/base'
import { ChromeNode } from '@engine/types/chrome'
import { ipcMain } from 'electron'

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
    .build()
}

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
