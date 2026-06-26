import { ChromeNode } from '@engine/chrome/model'
import { AppMode } from '../context/UIContext'

interface NavItemProps {
  node: ChromeNode
  titleKey?: string
  iconKey?: string
  isActive: boolean
  onClick: (mode: AppMode) => void
}

function NavItem({
  node,
  titleKey = 'title',
  iconKey = 'icon',
  isActive = false,
  onClick
}: NavItemProps): React.JSX.Element {
  const title = String(node.data[titleKey] ?? node.data.id ?? 'UNKNOWN')
  const icon = String(node.data[iconKey] ?? '󰋘')
  const routeMode = node.data.routeMode
  const baseStyle =
    'block py-2 px-6 transition-all duration-150 text-t3 hover:bg-surface-t1/50 hover:text-t2'
  const activeStyle = 'decorator-beta-active-focus text-t2'

  return (
    <a
      href="#"
      className={`${baseStyle} ${isActive ? activeStyle : ''}`}
      onClick={(e) => {
        e.preventDefault()
        onClick(routeMode)
      }}
    >
      {icon} {title}
    </a>
  )
}

export default NavItem
