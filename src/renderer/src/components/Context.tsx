import { useEffect, useState } from 'react'
import { GraphNode } from '@engine/types/base'
import Title from './Title'
import { createChromeNode } from '@engine/logic/chrome'

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
    <div className="w-1/4 flex flex-col border-r border-transparent layout-t2-see-through overflow-y-auto p-4">
      <Title
        node={titleNode}
        variant="h2"
        titleKey="title"
        iconKey="icon"
        subTitleKey="description"
      />
      <>
        {nodes.map((node) => (
          <p key={node.id} className="text-t3 truncate text-accent">
            󰋘 {String(node.data?.title)}
          </p>
        ))}
      </>
    </div>
  )
}

export default Context
