import { GraphNode } from '@engine/types/base'

interface CardItemprops {
  node: GraphNode
  titleKey?: string
  contentKey?: string
  iconKey?: string
  isFocused: boolean
}

function Card({
  node,
  titleKey = 'title',
  iconKey = 'icon',
  contentKey,
  isFocused = false
}: CardItemprops): React.JSX.Element {
  const title = String(node.data[titleKey] ?? node.data.id ?? 'UNKNOWN')
  const icon = String(node.data[iconKey] ?? '󰋘')
  const baseStyle = 'p-3 mb-2 bg-surface-t3 rounded transition-all duration-300'
  const recordState = String(node.meta?.recordState ?? 'invalid')
  const engagementState = String(node.meta?.engagementState ?? 'inactive')
  const tierMap: Record<string, Record<string, { focus: string; blur: string }>> = {
    invalid: {
      active: { focus: 'decorator-alpha-active-focus', blur: 'decorator-alpha-active-blur' },
      inactive: { focus: 'decorator-alpha-inactive-focus', blur: 'decorator-alpha-inactive-blur' }
    },
    committed: {
      active: { focus: 'decorator-beta-active-focus', blur: 'decorator-beta-active-blur' },
      inactive: { focus: 'decorator-beta-inactive-focus', blur: 'decorator-beta-inactive-blur' }
    },
    proposed: {
      active: { focus: 'decorator-gamma-active-focus', blur: 'decorator-gamma-active-blur' },
      inactive: { focus: 'decorator-gamma-inactive-focus', blur: 'decorator-gamma-inactive-blur' }
    },
    draft: {
      active: { focus: 'decorator-delta-active-focus', blur: 'decorator-delta-active-blur' },
      inactive: { focus: 'decorator-delta-inactive-focus', blur: 'decorator-delta-inactive-blur' }
    },
    failed: {
      active: { focus: 'decorator-epsilon-active-focus', blur: 'decorator-epsilon-active-blur' },
      inactive: {
        focus: 'decorator-epsilon-inactive-focus',
        blur: 'decorator-epsilon-inactive-blur'
      }
    }
  }
  const targetTier = tierMap[recordState] ?? tierMap['invalid']
  const targetEngagement = targetTier[engagementState] ?? targetTier['inactive']
  const decoratorStyle = isFocused ? targetEngagement.focus : targetEngagement.blur
  let description = ''
  if (contentKey) {
    description = String(node.data[contentKey] ?? '')
  }
  return (
    <div className={`${baseStyle} ${decoratorStyle}`}>
      <div className="text-t3 mb-1 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      {description && <div className="text-t4 whitespace-pre-wrap">{description}</div>}
    </div>
  )
}

export default Card
