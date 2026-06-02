import { GraphNode } from '@engine/model/base'
import { useEffect, useState } from 'react'

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
  let description = ''
  contentKey && (description = String(node.data[contentKey] ?? ''))
  const [desc, setDesc] = useState(description)
  const [decStyle, setDecStyle] = useState(resolveDecoratorStyle(node, isFocused))
  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on(
      'node:updated',
      (_event, updatedNode: GraphNode) => {
        if (updatedNode.id === node.id) {
          contentKey && setDesc(String(updatedNode.data[contentKey] ?? ''))
          setDecStyle(resolveDecoratorStyle(updatedNode, isFocused))
        }
      }
    )
    return () => {
      removeListener()
    }
  }, [contentKey, node.id, isFocused])
  return (
    <div className={`${baseStyle} ${decStyle}`}>
      <div className="text-t3 mb-1 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      {desc && <div className="text-t4 whitespace-pre-wrap">{desc}</div>}
    </div>
  )
}

function resolveDecoratorStyle(node: GraphNode, isFocused: boolean): string {
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
