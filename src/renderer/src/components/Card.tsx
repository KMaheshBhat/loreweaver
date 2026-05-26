import { GraphNode } from '@engine/types/base'

interface CardItemprops {
  node: GraphNode
  titleKey?: string
  contentKey?: string
  iconKey?: string
  isActive: boolean
  isFocused: boolean
}

function Card({
  node,
  titleKey = 'title',
  iconKey = 'icon',
  contentKey,
  isActive = false,
  isFocused = false
}: CardItemprops): React.JSX.Element {
  const title = String(node.data[titleKey] ?? node.data.id ?? 'UNKNOWN')
  const icon = String(node.data[iconKey] ?? '󰋘')
  const baseStyle = 'p-3 mb-2 bg-surface-t3 rounded transition-all duration-300'
  const styleMap = {
    'active-focused': 'decorator-beta-focus',
    'active-blurred': 'decorator-beta-blur',
    'inactive-focused': 'decorator-gamma-focus',
    'inactive-blurred': 'decorator-gamma-blur'
  }
  const stateKey = `${isActive ? 'active' : 'inactive'}-${isFocused ? 'focused' : 'blurred'}`
  const style = styleMap[stateKey]
  let description = ''
  if (contentKey) {
    description = String(node.data[contentKey] ?? '')
  }
  return (
    <div className={`${baseStyle} ${style}`}>
      <div className="text-t3 mb-1">
        {icon} {title}
      </div>
      <div className="text-t4">{description}</div>
    </div>
  )
}

export default Card
