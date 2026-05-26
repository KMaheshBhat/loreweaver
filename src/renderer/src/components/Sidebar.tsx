import { useEffect, useState } from 'react'
import { useUI } from '../context/UIContext'
import { GraphNode } from '@engine/types/base'
import { ChromeNode } from '@engine/types/chrome'
import Title from './Title'
import NavItem from './NavItem'

function Sidebar(): React.JSX.Element {
  const { currentMode, setCurrentMode } = useUI()
  const [appNode, setAppNode] = useState<GraphNode>()
  const [sidebarNodes, setSidebarNodes] = useState<ChromeNode[]>([])

  useEffect(() => {
    window.api.engine.app().then((rawNode: GraphNode) => {
      setAppNode(rawNode)
    })
  }, [])
  useEffect(() => {
    window.api.engine.chrome.sidebarNodes().then((rawNodes: ChromeNode[]) => {
      setSidebarNodes(rawNodes)
    })
  }, [])

  return (
    <>
      <aside className="w-50 bg-surface-t2-panel flex-shrink-0 flex flex-col border-r border-transparent layout-t2-see-through">
        {appNode && (
          <Title
            node={appNode}
            variant="h1"
            titleKey="title"
            iconKey="icon"
            subTitleKey="version"
          />
        )}
        <nav className="mt-4 flex-1">
          {sidebarNodes.map((node) => (
            <NavItem
              key={node.id}
              node={node}
              isActive={currentMode === node.data.routeMode}
              onClick={setCurrentMode}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
