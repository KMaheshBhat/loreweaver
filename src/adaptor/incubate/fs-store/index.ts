import { RecordProvider, RecordIntent, RecordResult } from '@engine/port/record'
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, basename, extname } from 'node:path'
import matter from 'gray-matter'
import { DataNode, DataNodeMap } from '@engine/model/hami'

/**
 * Standardized FSStore Adaptor.
 * Aligned with TBC Record and the Vault standards.
 * Enforces flat front matter and Title-to-Content replication.
 */
export class FSStoreIncubate implements RecordProvider {
  public readonly kind = 'fs-store:incubate'
  private rootDirectory: string

  constructor(options: { rootDirectory: string }) {
    this.rootDirectory = options.rootDirectory
    if (!existsSync(this.rootDirectory)) {
      mkdirSync(this.rootDirectory, { recursive: true })
    }
  }

  public canHandle(intent: RecordIntent): boolean {
    const supported = ['record:hydrate', 'record:commit']
    return supported.includes(intent.kind)
  }

  public async execute(intent: RecordIntent): Promise<RecordResult> {
    const collection = intent.options.collection as string
    const collectionPath = join(this.rootDirectory, collection)

    switch (intent.kind) {
      case 'record:hydrate':
        return this.hydrateCollection(collection, collectionPath)

      case 'record:commit':
        return this.commitNodes(collectionPath, intent.nodes as DataNode[])

      default:
        throw new Error(`[FSStore] Unsupported intent: ${intent.kind}`)
    }
  }

  /**
   * Reconstitutes BaseNodes from standardized Vault Markdown files.
   * Logic: Strips Markdown headers and re-prefixes IDs for Ledger compatibility.
   */
  private hydrateCollection(collection: string, path: string): DataNodeMap {
    if (!existsSync(path)) return {}

    const nodes: DataNodeMap = {}
    const files = readdirSync(path).filter((f) => f.endsWith('.md'))

    files.forEach((file) => {
      const fullPath = join(path, file)
      const raw = readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(raw)

      // 1. Reconstruct Ledger ID and Kind
      const shortId = data.id || basename(file, extname(file))
      const recordType = data.record_type || 'generic'
      const fullId = `${collection}:${recordType}:${shortId}`

      const body = content.replace(/^# .*\n+/, '').trim()

      // 2. Map flattened YAML back to Data dictionary
      const { edges, ...restData } = data
      delete restData.id
      delete restData.record_type

      nodes[fullId] = {
        id: fullId,
        kind: `loreweaver:${recordType}`,
        data: { ...restData, content: body },
        edges: edges || [],
        meta: {} // Meta is System of Engagement only
      } as DataNode
    })

    return nodes
  }

  /**
   * Persists BaseNodes as standardized Vault Markdown files.
   * Logic: Collapses data, strips prefixes, and syncs Title to Body.
   */
  private commitNodes(path: string, nodes: DataNode[]): void {
    if (!existsSync(path)) mkdirSync(path, { recursive: true })

    nodes.forEach((node) => {
      // 1. Extract short ID (strip collection/kind prefixes)
      const parts = node.id.split(':')
      const shortId = parts[parts.length - 1]
      const fileName = `${shortId}.md`

      // 2. Prepare Data Flattening & Title Sync
      const nodeData = node.data as {
        content?: string
        title?: string
        record_title?: string
      } & Record<string, unknown>
      const { content, title, record_title, ...restData } = nodeData
      const displayTitle = title || record_title || ''

      // 3. Replicate Title into Content as H1
      const body = displayTitle ? `# ${displayTitle}\n\n${content || ''}` : content || ''

      // 4. Construct Standardized Front Matter
      const frontMatter = {
        id: shortId,
        record_type: node.kind,
        ...restData, // Collapsed data keys
        edges: node.edges
        // Meta is intentionally omitted (SoE-only)
      }

      writeFileSync(join(path, fileName), matter.stringify(body, frontMatter))
    })
  }
}
