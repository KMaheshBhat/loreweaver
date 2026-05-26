import { useEffect, useState } from 'react'
import { GraphNode } from '@engine/types/base'
import Title from './Title'
import { createChromeNode } from '@engine/logic/chrome'
import Card from './Card'

function Context(): React.JSX.Element {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const titleNode = createChromeNode('context')
    .withTitle('Context')
    .withIcon('󰛡')
    .withData({ description: 'The Precursor' })
    .build()

  useEffect(() => {
    window.api.engine.weaver.nodes().then((rawNodes: GraphNode[]) => {
      setNodes(rawNodes)
    })
  }, [])

  return (
    <div className="w-1/4 flex flex-col border-r border-transparent layout-t2-see-through overflow-y-auto custom-terminal-scroll">
      <div className="sticky top-0 z-10 bg-surface-t1 px-4 pt-4 pb-3 border-b border-surface-t2-border/70">
        <Title
          node={titleNode}
          variant="h2"
          titleKey="title"
          iconKey="icon"
          subTitleKey="description"
        />
      </div>
      <div className="flex-1 p-4 pt-3">
        {nodes.map((node, index) => {
          const isActive = index % 2 === 1 || index % 4 === 3
          const isFocused = index % 4 >= 2
          return (
            <Card
              key={node.id}
              node={node}
              titleKey="title"
              iconKey="icon"
              contentKey="content"
              isActive={isActive}
              isFocused={isFocused}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Context
