import { BaseNode } from '@engine/model/base'
import { useUI } from '@renderer/context/UIContext'
import { useEffect, useState } from 'react'

interface CardItemprops {
  node: BaseNode
  titleKey?: string
  contentKey?: string
  iconKey?: string
  column: string
}

function Card({
  node,
  titleKey = 'title',
  iconKey = 'icon',
  contentKey,
  column
}: CardItemprops): React.JSX.Element {
  const { setFocus, focusedNodeId } = useUI()
  const [liveNode, setLiveNode] = useState<BaseNode>(node)
  const isFocused = liveNode.id === focusedNodeId
  const decStyle = resolveDecoratorStyle(liveNode, isFocused)
  const title = String(liveNode.data[titleKey] ?? liveNode.id ?? 'UNKNOWN')
  const icon = String(liveNode.data[iconKey] ?? '󰋘')
  const baseStyle = 'p-3 mb-2 bg-surface-t3 rounded transition-all duration-100 cursor-pointer'
  const desc = contentKey ? String(liveNode.data[contentKey] ?? '') : ''

  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on(
      'node:updated',
      (_event, updatedNode: BaseNode) => {
        if (updatedNode.id === node.id) {
          setLiveNode(updatedNode)
        }
      }
    )
    return () => removeListener()
  }, [node.id])

  return (
    <div className={`${baseStyle} ${decStyle}`} onClick={() => setFocus(liveNode.id, column)}>
      <div className="text-t3 mb-1 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      {desc && <div className="text-t4 whitespace-pre-wrap">{desc}</div>}
    </div>
  )
}
function resolveDecoratorStyle(node: BaseNode, isFocused: boolean): string {
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
  return isFocused ? targetEngagement.focus : targetEngagement.blur
}

export default Card
