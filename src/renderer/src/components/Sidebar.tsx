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
    const hydrateSidebarData = async (): Promise<void> => {
      const [rawAppNode, rawSidebarNodes] = await Promise.all([
        window.api.engine.client(),
        window.api.engine.chrome.sidebarNodes()
      ])
      setAppNode(rawAppNode)
      setSidebarNodes(rawSidebarNodes)
    }

    hydrateSidebarData()
  }, [])

  return (
    <aside className="w-50 bg-surface-t2-panel flex-shrink-0 flex flex-col border-r border-transparent layout-t2-see-through">
      <div className="px-6 pt-6 min-h-[88px]">
        {appNode ? (
          <Title
            node={appNode}
            variant="h1"
            titleKey="title"
            iconKey="icon"
            subTitleKey="version"
          />
        ) : (
          <div className="animate-pulse bg-surface-t2-border/20 h-12 rounded w-4/5" />
        )}
      </div>
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
  )
}

export default Sidebar
