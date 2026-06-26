import { createBaseNode, BaseNode } from '@engine/model'
import { createChromeNode } from '@engine/chrome/model'
import { useEffect, useState, useRef } from 'react'
import Card from './Card'
import Title from './Title'
import { useUI } from '@renderer/context/UIContext'

function Tapestry(): React.JSX.Element {
  const { setFocusedColumn, isBusy, setBusy } = useUI()
  const [nodes, setNodes] = useState<BaseNode[]>([])
  const [titleNode, setTitleNode] = useState<BaseNode>()
  const [draft, setDraft] = useState('')
  const prefixesRef = useRef<string[]>([])

  useEffect(() => {
    const hydrateColumnData = async (): Promise<void> => {
      const sidebarNodes = await window.api.engine.chrome.sidebarNodes()
      const allNodes = await window.api.engine.weaver.nodes()
      const weaverConfig = sidebarNodes.find((node) => node.id === 'weaver')
      const tTitle = weaverConfig?.data?.tapestry?.['title'] ?? ''
      const tIcon = weaverConfig?.data?.tapestry?.['icon'] ?? ''
      const tSubtitle = weaverConfig?.data?.tapestry?.['subTitle'] ?? ''
      const tNode = createChromeNode('tapestry')
        .withTitle(tTitle)
        .withIcon(tIcon)
        .withData({ subTitle: tSubtitle })
        .build()
      setTitleNode(tNode)
      const targetPrefixes: string[] = weaverConfig?.data?.tapestry?.['prefixes'] ?? []
      prefixesRef.current = targetPrefixes
      const filtered = allNodes.filter((node) =>
        targetPrefixes.some((prefix) => node.data.group.startsWith(prefix))
      )
      setNodes(filtered)
    }
    hydrateColumnData()
    const removeListener = window.electron.ipcRenderer.on(
      'node:created',
      (_event, newNode: BaseNode) => {
        if (prefixesRef.current.some((prefix) => newNode.data.group.startsWith(prefix))) {
          setNodes((prev) => {
            if (prev.find((n) => n.id === newNode.id)) return prev // Prevent duplicates
            return [...prev, newNode]
          })
        }
      }
    )
    return () => {
      removeListener()
    }
  }, [])

  const handleIntent = async (): Promise<void> => {
    if (!draft.trim() || isBusy) return
    const turnId = `req:${Date.now()}`
    const proposedNode = createBaseNode(`weave:turn:${turnId}`)
      .withGroup('weave:turn')
      .withData({
        group: 'weave',
        title: `Turn #${nodes.length + 1}`,
        content: draft,
        timestamp: Date.now()
      })
      .withMeta({
        recordState: 'proposed',
        engagementState: 'active'
      })
      .withEdge({
        kind: 'after',
        toNodeId: nodes[nodes.length - 1].id,
        data: {}
      })
      .build()
    setBusy(true)
    await window.api.engine.weaver.submitTurn(proposedNode)
    setDraft('')
  }
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/*
          1. Fixed Header:
          Uses 'shrink-0' to stay locked. Removed 'sticky' as the
          flex-col parent ensures it stays anchored at the top [Conversation History].
        */}
      <div className="shrink-0 bg-surface-t1 px-4 pt-4 pb-3 border-b border-surface-tier2-border/70 custom-header">
        {titleNode ? (
          <Title
            node={titleNode}
            variant="h2"
            titleKey="title"
            iconKey="icon"
            subTitleKey="subTitle"
          />
        ) : (
          <div className="animate-pulse bg-surface-t2-border/20 h-10 rounded" />
        )}
      </div>

      {/*
          2. Scrollable Prose Canvas:
          Uses 'flex-1' and 'overflow-y-auto' to claim all vertical real estate
          between the Header and the Forge [3, 4].
        */}
      <div className="flex-1 overflow-y-auto custom-terminal-scroll p-4 pt-3">
        {nodes.map((node) => {
          return (
            <Card
              key={node.id}
              node={node}
              titleKey="title"
              iconKey="icon"
              contentKey={['thinkContent', 'content']}
              column="tapestry"
            />
          )
        })}
      </div>

      {/*
          3. The Forge (Input Deck):
          Uses 'shrink-0' to stay firmly anchored to the bottom,
          ensuring the command levers are always accessible [2, 4].
        */}
      <div
        className="flex flex-col gap-2 p-4 bg-surface-t1 border-t border-surface-tier2-border/40 shrink-0"
        onClick={() => setFocusedColumn('tapestry')}
      >
        <textarea
          value={draft}
          disabled={isBusy}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full min-h-22.5 p-3 text-t3 bg-surface-t2-panel rounded-none outline-none resize-none transition-all duration-150 decorator-delta-active-blur focus:decorator-delta-active-focus"
          placeholder="Draft your turn ..."
        />
        <button
          onClick={handleIntent}
          disabled={isBusy || !draft.trim()}
          type="button"
          className="w-full py-2.5 text-center font-bold tracking-wider uppercase cursor-pointer rounded-none outline-none transition-all duration-150 bg-surface-t2-panel text-t1 border border-transparent hover:decorator-delta-active-focus active:scale-[0.99]"
        >
          {isBusy ? '󰫇 Weaving ...' : '󰋙 Go! Go! Go!'}
        </button>
      </div>
    </div>
  )
}

export default Tapestry
