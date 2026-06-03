import { createBaseNode, BaseNode } from '@engine/model/base'
import { createChromeNode } from '@engine/model/chrome'
import { useEffect, useState, useRef } from 'react'
import Card from './Card'
import Title from './Title'

function Tapestry(): React.JSX.Element {
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
        targetPrefixes.some((prefix) => node.id.startsWith(prefix))
      )
      setNodes(filtered)
    }
    hydrateColumnData()
    const removeListener = window.electron.ipcRenderer.on(
      'node:created',
      (_event, newNode: BaseNode) => {
        if (prefixesRef.current.some((prefix) => newNode.id.startsWith(prefix))) {
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
    if (!draft.trim()) return
    const proposedNode = createBaseNode(`weave:turn:${Date.now()}`)
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
      .build()
    await window.api.engine.weaver.submitTurn(proposedNode)
    setDraft('')
  }

  return (
    <div className="w-1/2 h-full flex flex-col border-r border-transparent layout-t2-see-through overflow-hidden">
      {/* Locked Header */}
      <div className="sticky top-0 z-10 bg-surface-t1 px-4 pt-4 pb-3 border-b border-surface-t2-border/70 custom-header">
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
      <div className="flex-1 p-4 pt-3 overflow-y-auto custom-terminal-scroll">
        {nodes.map((node, index) => {
          const isFocused = index % 4 >= 2
          return (
            <Card
              key={node.id}
              node={node}
              titleKey="title"
              iconKey="icon"
              contentKey="content"
              isFocused={isFocused}
            />
          )
        })}
      </div>
      <div className="flex flex-col gap-2 p-4 bg-surface-t1 border-t border-surface-t2-border/40 layout-t2-see-through shrink-0">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full min-h-22.5 p-3 text-t3 bg-surface-t2-panel rounded-none outline-none resize-none transition-all duration-150 decorator-delta-active-blur focus:decorator-delta-active-focus"
          placeholder="Draft your turn ..."
        />
        <button
          onClick={handleIntent}
          type="button"
          className="w-full py-2.5 text-center font-bold tracking-wider uppercase cursor-pointer rounded-none outline-none transition-all duration-150 bg-surface-t2-panel text-t1 border border-transparent hover:decorator-delta-active-focus active:scale-[0.99]"
        >
          󰋙 Go! Go! Go!
        </button>
      </div>
    </div>
  )
}

export default Tapestry
