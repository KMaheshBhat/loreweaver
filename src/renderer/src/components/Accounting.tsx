import { BaseNode } from '@engine/model/base'
import { createChromeNode } from '@engine/model/chrome'
import { useEffect, useState } from 'react'
import Card from './Card'
import Title from './Title'

function Accounting(): React.JSX.Element {
  const [nodes, setNodes] = useState<BaseNode[]>([])
  const [titleNode, setTitleNode] = useState<BaseNode>()

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
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/*
        1. Fixed Header:
        Uses 'shrink-0' to stay anchored at the top of the column.
        Removed 'sticky' to allow the flex layout to handle the lock.
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
        2. Scrollable Telemetry List:
        Uses 'flex-1' and 'overflow-y-auto' to claim remaining height
        and enable the internal scroll context.
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
              column="accounting"
            />
          )
        })}
      </div>
    </div>
  )
}

export default Accounting
