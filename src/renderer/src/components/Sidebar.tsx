import { GraphNode } from '@engine/model/base'
import { ChromeNode, createChromeNode } from '@engine/model/chrome'
import { useEffect, useMemo, useState } from 'react'
import { useUI } from '../context/UIContext'
import NavItem from './NavItem'
import Title from './Title'

function Sidebar(): React.JSX.Element {
  const { currentMode, setCurrentMode } = useUI()
  const [appNode, setAppNode] = useState<GraphNode>()
  const [sidebarNodes, setSidebarNodes] = useState<ChromeNode[]>([])

  // Stabilize structural leaf node to prevent re-instantiation thrashing
  const exitNode = useMemo(
    () => createChromeNode('exit').withTitle('Exit').withIcon('󰿅').build(),
    []
  )

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
    <aside className="w-50 bg-surface-t2-panel flex-shrink-0 flex flex-col border-r border-transparent layout-t2-see-through h-full">
      {/* Draggable Zone Header */}
      <div className="px-6 pt-6 min-h-[88px] custom-header select-none">
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

      {/* Nav Splitter: Flex-col pushes exit button cleanly to the baseline */}
      <nav className="mt-4 flex-1 flex flex-col justify-between pb-4">
        {/* Upper Navigation Block */}
        <div className="flex flex-col space-y-1">
          {sidebarNodes.map((node) => (
            <NavItem
              key={node.id}
              node={node}
              isActive={currentMode === node.data.routeMode}
              onClick={setCurrentMode}
            />
          ))}
        </div>

        {/* Lower Core Control Anchor */}
        <div className="border-t border-surface-t2-border/10 pt-4">
          <NavItem
            key={exitNode.id}
            node={exitNode}
            isActive={false}
            onClick={() => {
              if (confirm('Are you sure you want to close the narrative engine?')) {
                window.api.engine.chrome.exitApp()
              }
            }}
          />
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
