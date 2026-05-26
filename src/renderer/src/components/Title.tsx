import { GraphNode } from '@engine/types/base'

interface TitleProps {
  node: GraphNode
  variant?: 'h1' | 'h2'
  titleKey?: string
  iconKey?: string
  subTitleKey?: string
}

function Title({
  node,
  variant = 'h2',
  titleKey = 'title',
  iconKey,
  subTitleKey
}: TitleProps): React.JSX.Element {
  const nodeData = node.data as Record<string, unknown>
  const title = String(nodeData[titleKey] ?? 'UNKNOWN')
  const icon = nodeData[iconKey ?? 'icon']
  const subTitle = nodeData[subTitleKey ?? 'subTitle']
  const variantMap = {
    h1: 'text-t1',
    h2: 'text-t2'
  }
  let fullTitle = ''
  if (icon) {
    fullTitle = `${icon} ${title}`
  } else {
    fullTitle = title
  }

  return (
    <>
      <div className={`${variantMap[variant]} text-t1`}>{fullTitle}</div>
      {subTitle && <div className="text-t4 text-accent">{String(subTitle)}</div>}
    </>
  )
}

export default Title
