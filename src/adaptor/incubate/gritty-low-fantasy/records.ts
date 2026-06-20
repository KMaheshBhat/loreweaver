import { createBaseNode, BaseNodeMap } from '@engine/model/base'

export const seedNodes: BaseNodeMap = {
  weaveInstructions: createBaseNode('20260600000000')
    .withGroup('weave:instructions')
    .withData({
      title: 'System Instructions',
      content: 'You are an expert story teller.  Continue the story given the following details.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),
  character1: createBaseNode('20260605000000')
    .withGroup('weave:char')
    .withData({
      title: 'Valen "The Unseen"',
      isUser: true,
      content:
        'Name: Valen "The Unseen"\n' +
        'Title: The Incognito Scion / The Gilded Exile\n' +
        'Origins: The Iron Spires (Capital of a decaying empire)\n' +
        'Aliases: Val (his traveling identity), The Disinherited\n' +
        'Primary Weapon: A razor-sharp wit, a hidden Sovereign Seal, and the dangerous weight of a lineage he is trying to outrun.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),
  character2: createBaseNode('20260605000001')
    .withGroup('weave:char')
    .withData({
      title: 'Kaelen "The Bound"',
      isUser: true,
      content:
        'Name: Kaelen "The Bound"\n' +
        'Title: The Disgraced Guardian / The Wayward Sword\n' +
        'Origins: The Sinking Slums (A nameless gutter beneath the Iron Spires)\n' +
        'Aliases: Kael the Wall, The Unbroken\n' +
        'Primary Weapon: A scarred claymore, a notched heavy shield, and a massive physical frame built from years of desperate survival.'
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),
  summary1: createBaseNode('20260605000100')
    .withGroup('weave:summary')
    .withData({
      title: 'The Tournament of the Marches',
      isUser: true,
      content:
        "Kaelen is a wandering sword traveling alone until he reluctantly takes on Valen—a disguised, runaway noble scion—as his ward. When Kaelen strikes a high-born lord to protect a helpless traveler, his life is forfeit until Valen reveals his hidden Sovereign Seal and triggers a legendary Judicial Combat. Though Kaelen survives the brutal trial, the High Lord's heir is tragically slain, prompting Valen's father to let the youth continue traveling incognito with Kaelen to learn the ways of the common folk before he ever takes his place among the elite."
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),
  summary2: createBaseNode('20260605000101')
    .withGroup('weave:summary')
    .withData({
      title: 'The Spires Sedition',
      isUser: true,
      content:
        'Looking for work, the duo arrives at a remote keep for what is advertised as a peaceful wedding feast, only for Kaelen to slowly realize they have walked into a nest of Seditionist traitors plotting a rebellion against the Iron Spires. Valen is captured trying to use his hidden identity to stop the uprising, forcing a heavily wounded Kaelen to bluff his way past bloodthirsty lords and rescue his ward before the Imperial Guard arrives to crush the treasonous plot. The pair narrowly slips away into the countryside before the chaos can expose them, leaving them paranoid, exhausted, and desperately trying to keep a lower profile at any local inn.'
    })
    .withEdge({
      kind: 'after',
      toNodeId: '20260605000100',
      data: {}
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),
  scenario: createBaseNode('20260605000200')
    .withGroup('weave:scenario')
    .withData({
      title: 'A Dusty Crossroads Inn',
      content:
        '## The Scenario: A Dusty Crossroads Inn\n' +
        'Kaelen stands frozen in a crowded tavern yard, his massive frame blocking the doorway as a group of hostile, drunk local guards close in around him. Valen, a travel-worn youth in muddy boots, steps out from behind Kaelen\'s massive legs, crossing his arms and boldly flashing a heavy Sovereign Seal. The tavern falls completely silent as the guards instantly drop to their knees in terror."'
    })
    .withEdge({
      kind: 'after',
      toNodeId: '20260605000101',
      data: {}
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),
  turn75: createBaseNode('20260605000300')
    .withGroup('weave:turn')
    .withData({
      title: 'Turn #0',
      content:
        'Kaelen lets out a heavy sigh, rubs his temples, and mutters, "Valen, you fool, we were supposed to be keeping a low profile."',
      timestamp: 1774432800000
    })
    .withEdge({
      kind: 'after',
      toNodeId: '20260605000200',
      data: {}
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'active'
    })
    .build(),
  result75_1: createBaseNode('20260605000300-1')
    .withGroup('weave:engine:result')
    .withData({
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
      toNodeId: 'weave:turn:20260605000300',
      data: {}
    })
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),
  result76_1: createBaseNode('20260605000301-1')
    .withGroup('weave:engine:result')
    .withData({
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
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),
  result76_2: createBaseNode('20260605000301-2')
    .withGroup('weave:engine:result')
    .withData({
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
    .withMeta({
      recordState: 'committed',
      engagementState: 'inactive'
    })
    .build(),
  result77_1: createBaseNode('20260605000302-1')
    .withGroup('weave:engine:result')
    .withData({
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
    .withMeta({
      recordState: 'proposed',
      engagementState: 'active'
    })
    .build()
}
