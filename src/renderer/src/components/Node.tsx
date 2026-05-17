interface NodeProps {
  content: string
}

export function Card({ content }: NodeProps): React.JSX.Element {
  return <div>{content}</div>
}

interface NodePropsWithTurn {
  id: number
  content: string
  timestamp?: string
  active?: boolean
}

export function Node({ id, content, timestamp, active }: NodePropsWithTurn): React.JSX.Element {
  return (
    <li
      className={`p-3 mb-2 bg-chrome-surface rounded border transition-all duration-300 ${
        active ? 'border-accent box-glow' : 'border-chrome-border'
      }`}
    >
      <div className="text-xs text-accent mb-1">Turn #{id}</div>
      <div className="text-sm text-white">{content}</div>
      {timestamp && <div className="text-xs text-white/50 mt-1">{timestamp}</div>}
    </li>
  )
}
