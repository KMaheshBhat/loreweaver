import { useEffect, useState } from 'react'
import { GraphNode } from '@engine/types/base'
import Title from './Title'
import { createChromeNode } from '@engine/logic/chrome'
import Card from './Card'

function Tapestry(): React.JSX.Element {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [titleNode, setTitleNode] = useState<GraphNode>()

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
      const filtered = allNodes.filter((node) =>
        targetPrefixes.some((prefix) => node.id.startsWith(prefix))
      )
      setNodes(filtered)
    }
    hydrateColumnData()
  }, [])

  return (
    <div className="w-1/2 flex flex-col border-r border-transparent layout-t2-see-through overflow-y-auto custom-terminal-scroll">
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
      <div className="flex-1 p-4 pt-3">
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
      {/* Bottom-anchored Active Synthesis Input Deck */}
      <div className="flex flex-col gap-2 p-4 bg-surface-t1 border-t border-transparent layout-t2-see-through">
        <textarea
          className="w-full min-h-[90px] p-3 text-t3 bg-surface-t1-panel rounded-none outline-none resize-none transition-all duration-150 decorator-delta-active-blur focus:decorator-delta-active-focus"
          placeholder="Draft your turn ..."
        />
        <button
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
