import { useEffect, useState } from 'react'
import { useUI } from '../context/UIContext'
import { GraphNode } from '@engine/types/base'
import { ChromeNode } from '@engine/types/chrome'

function Sidebar(): React.JSX.Element {
  const { currentMode, setCurrentMode } = useUI()
  const [version] = useState(window.electron.process.env.npm_package_version)
  const [nodes, setNodes] = useState<GraphNode[]>([])

  useEffect(() => {
    window.api.engine.querySidebarNodes().then((rawNodes: GraphNode[]) => {
      console.log('Got sidebar nodes', rawNodes)
      setNodes(rawNodes)
    })
  }, [])

  return (
    <>
      <aside className="w-50 bg-surface-t2-panel flex-shrink-0 flex flex-col border-r border-transparent layout-t2-see-through">
        <div className="px-6 pt-6 text-t1"> LoreWeaver</div>
        <div className="px-6 text-t4 text-accent">{version}</div>
        <nav className="mt-4 flex-1">
          {nodes.map((node) => {
            const chromeNode = node as ChromeNode
            const title = chromeNode.data.title ?? chromeNode.data.id ?? 'UNKNOWN'
            const icon = chromeNode.data.icon ?? '󰋘'
            const routeMode = chromeNode.data.routeMode
            return (
              <a
                key={chromeNode.id}
                href="#"
                className={`block py-2 px-6 hover:bg-surface-t1/50 text-t3 ${currentMode === routeMode ? 'decorator-beta-focus' : ''} hover:text-t2`}
                onClick={() => setCurrentMode(routeMode)}
              >
                {icon} {title}
              </a>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
