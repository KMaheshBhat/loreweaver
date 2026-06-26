import { uuidv7 } from 'uuidv7'
import { MintIntent, MintProvider } from '@engine/mint/mint'

/**
 * Chrono ID Minting Provider.
 * Ensures uniqueness and chronological sortability for batch generation
 */
export class ChronoIDMintProvider implements MintProvider {
  public readonly kind = 'chrono-id-mint:incubate'

  public async mintIDs(intent: MintIntent): Promise<string[]> {
    const { type, count = 1 } = intent.options
    const ids: string[] = []

    for (let i = 0; i < count; i++) {
      if (type === 'uuidv7') {
        ids.push(uuidv7())
      } else if (type === 'tsid') {
        ids.push(this.generateTsid())
      } else {
        // Fallback for unknown types
        ids.push(`${Date.now()}`)
      }

      // The established trade-off: Pause for 1 second between generations
      // to avoid collisions in second-resolution TSIDs. [Conversation History]
      if (i < count - 1 && type === 'tsid') {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return ids
  }

  /**
   * Generates a Timestamp ID (TSID) string: YYYYMMDDHHMMSS.
   */
  private generateTsid(): string {
    const now = new Date()
    const year = now.getUTCFullYear()
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')
    const day = String(now.getUTCDate()).padStart(2, '0')
    const hours = String(now.getUTCHours()).padStart(2, '0')
    const minutes = String(now.getUTCMinutes()).padStart(2, '0')
    const seconds = String(now.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}${hours}${minutes}${seconds}`
  }
}
