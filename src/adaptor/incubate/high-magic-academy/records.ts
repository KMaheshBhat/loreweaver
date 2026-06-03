import { createBaseNode, BaseNodeMap } from '@engine/model/base'

export const seedNodes: BaseNodeMap = {
  weaveInstructions: createBaseNode('weave:instructions')
    .withData({
      group: 'weave',
      title: 'System Instructions',
      content:
        'You are an expert fantasy storyteller. Continue the story given the following details.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),

  character1: createBaseNode('weave:char:elara')
    .withData({
      group: 'weave',
      title: 'Elara Finch',
      isUser: true,
      content:
        'Name: Elara Finch\nTitle: Apprentice Arcanist\nOrigins: Brindlemere, a foggy lake town known for glassblowers and potion herb gardens\nAliases: Finch\nPrimary Focus: Charms, magical cartography, and uncovering forgotten magical pathways.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),

  character2: createBaseNode('weave:char:corwin')
    .withData({
      group: 'weave',
      title: 'Corwin Thorne',
      isUser: true,
      content:
        'Name: Corwin Thorne\nTitle: Apprentice Magizoologist\nOrigins: High Barrow, a windswept settlement near the northern moors\nAliases: Thorn\nPrimary Focus: Magical creatures, defensive enchantments, and getting into trouble while attempting to help.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),

  summary1: createBaseNode('weave:summary:1')
    .withData({
      group: 'weave',
      title: 'The Moonroot Expedition',
      isUser: true,
      content:
        'Elara and Corwin were sent to recover a rare patch of moonroot growing inside a forgotten network of crystal caverns. What began as a simple field assignment became a race against a band of rogue relic hunters seeking an enchanted compass hidden deep within the caves. The apprentices recovered the compass, escaped a collapsing cavern chamber, and earned unexpected praise from their professors.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),

  summary2: createBaseNode('weave:summary:2')
    .withData({
      group: 'weave',
      title: 'The Clocktower Disturbance',
      isUser: true,
      content:
        'While assisting with maintenance of the academy clocktower, the pair discovered a dormant timekeeping spirit that had awakened after centuries of silence. The spirit began shifting objects and people several minutes out of sync with reality. After a chaotic night of duplicated schedules and temporal confusion, Elara and Corwin restored the tower mechanism and persuaded the spirit to return to its post.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),

  scenario: createBaseNode('weave:scenario')
    .withData({
      group: 'weave',
      title: 'The Lantern Vault',
      content:
        '## The Scenario: The Lantern Vault\nDeep beneath the Academy of Arcane Arts lies the Lantern Vault, a chamber lined with thousands of suspended glass lanterns. Each lantern contains a captured memory donated by generations of wizards and witches. During a routine cataloging assignment, one lantern suddenly shatters. A silver stream of memory escapes and begins drifting through the chamber, causing nearby lanterns to flicker awake. Strange voices echo through the darkness as forgotten moments begin leaking into the present. Elara tightens her grip on her wand while Corwin stares upward at the growing storm of glowing memories. Somewhere in the vault, something has awakened.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),

  turn75: createBaseNode('weave:turn:75')
    .withData({
      group: 'weave',
      title: 'Turn #75',
      content: 'The silver memory-stream coils between the lanterns.',
      timestamp: 1774432800000
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),

  result75_1: createBaseNode('engine:result:75-1')
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
        'SUCCESS: Narrative continuity maintained. Character motivations aligned with established scenario constraints.'
    })
    .withEdge({
      kind: 'causality-target',
      toNodeId: 'weave:turn:75',
      data: {}
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),

  turn76: createBaseNode('weave:turn:76')
    .withData({
      group: 'weave',
      title: 'Turn #76',
      content:
        'A lantern near the ceiling bursts, releasing a memory of a duel fought generations ago.',
      timestamp: 1774432860000
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),

  result76_1: createBaseNode('engine:result:76-1')
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
        'SUCCESS: Context graph expanded. Memory-fragment interactions resolved without continuity conflicts.'
    })
    .withEdge({
      kind: 'causality-target',
      toNodeId: 'weave:turn:76',
      data: {}
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),

  result76_2: createBaseNode('engine:result:76-2')
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
        'VALIDATION: Tone inspection completed. Setting consistency and magical-world assumptions preserved.'
    })
    .withEdge({
      kind: 'introspection-target',
      toNodeId: 'weave:turn:76',
      data: {}
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),

  turn77: createBaseNode('weave:turn:77')
    .withData({
      group: 'weave',
      title: 'Turn #77',
      content: 'Elara notices that several lanterns now display the same unknown crest...',
      timestamp: 1774432920000
    })
    .withMeta({
      recordState: 'hooga-booga',
      engagementState: 'active'
    })
    .build(),

  result77_1: createBaseNode('engine:result:77-1')
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
        'BEEP! TRY AGAIN! Narrative validator detected an unresolved artifact reference. Rebuilding inference branch.'
    })
    .withEdge({
      kind: 'introspection-target',
      toNodeId: 'weave:turn:77',
      data: {}
    })
    .withMeta({
      recordState: 'proposed',
      engagementState: 'active'
    })
    .build()
}
