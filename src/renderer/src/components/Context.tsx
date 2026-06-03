import { BaseNode } from '@engine/model/base'
import { createChromeNode } from '@engine/model/chrome'
import { useEffect, useState } from 'react'
import Card from './Card'
import Title from './Title'

function Context(): React.JSX.Element {
  const [nodes, setNodes] = useState<BaseNode[]>([])
  const [titleNode, setTitleNode] = useState<BaseNode>()

  useEffect(() => {
    const hydrateColumnData = async (): Promise<void> => {
      const sidebarNodes = await window.api.engine.chrome.sidebarNodes()
      const allNodes = await window.api.engine.weaver.nodes()
      const weaverConfig = sidebarNodes.find((node) => node.id === 'weaver')

      const tTitle = weaverConfig?.data?.context?.['title'] ?? ''
      const tIcon = weaverConfig?.data?.context?.['icon'] ?? ''
      const tSubtitle = weaverConfig?.data?.context?.['subTitle'] ?? ''

      const tNode = createChromeNode('context')
        .withTitle(tTitle)
        .withIcon(tIcon)
        .withData({ subTitle: tSubtitle })
        .build()

      setTitleNode(tNode)

      const targetPrefixes: string[] = weaverConfig?.data?.context?.['prefixes'] ?? []
      const filtered = allNodes.filter((node) =>
        targetPrefixes.some((prefix) => node.id.startsWith(prefix))
      )
      setNodes(filtered)
    }
    hydrateColumnData()
  }, [])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/*
        1. Fixed Header:
        Uses 'shrink-0' to stay locked at the top of the column.
        Removed 'sticky' as the flex-layout now manages the lock.
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
        2. Scrollable Card List:
        Uses 'flex-1' to take all remaining height.
        Uses 'overflow-y-auto' to enable internal scrolling.
        Uses 'custom-terminal-scroll' for the themed scrollbar.
      */}
      <div className="flex-1 overflow-y-auto custom-terminal-scroll p-4 pt-3">
        {nodes.map((node) => {
          return (
            <Card
              key={node.id}
              node={node}
              titleKey="title"
              iconKey="icon"
              contentKey="content"
              column="context"
            />
          )
        })}
      </div>
    </div>
  )
}

export default Context
