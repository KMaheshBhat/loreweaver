import { GraphNode } from '@engine/model/base'
import { createChromeNode } from '@engine/model/chrome'
import { useEffect, useState } from 'react'
import Card from './Card'
import Title from './Title'

function Accounting(): React.JSX.Element {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [titleNode, setTitleNode] = useState<GraphNode>()

  useEffect(() => {
    const hydrateColumnData = async (): Promise<void> => {
      const sidebarNodes = await window.api.engine.chrome.sidebarNodes()
      const allNodes = await window.api.engine.weaver.nodes()
      const weaverConfig = sidebarNodes.find((node) => node.id === 'weaver')
      const tTitle = weaverConfig?.data?.accounting?.['title'] ?? ''
      const tIcon = weaverConfig?.data?.accounting?.['icon'] ?? ''
      const tSubtitle = weaverConfig?.data?.accounting?.['subTitle'] ?? ''
      const tNode = createChromeNode('accounting')
        .withTitle(tTitle)
        .withIcon(tIcon)
        .withData({ subTitle: tSubtitle })
        .build()
      setTitleNode(tNode)
      const targetPrefixes: string[] = weaverConfig?.data?.accounting?.['prefixes'] ?? []
      const filtered = allNodes.filter((node) =>
        targetPrefixes.some((prefix) => node.id.startsWith(prefix))
      )
      setNodes(filtered)
    }
    hydrateColumnData()
  }, [])

  return (
    <div className="w-1/4 flex flex-col border-r border-transparent layout-t2-see-through overflow-y-auto custom-terminal-scroll">
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
    </div>
  )
}

export default Accounting
