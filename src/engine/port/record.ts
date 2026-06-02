import { GraphNode, GraphNodeMap } from '@engine/model/base'

/**
 * The persistence contract for the System of Record.
 * Implementations of this interface are responsible for loading
 * and committing graph nodes to/from storage.
 */
export interface RecordProvider {
  /**
   * Hydrates the authoritative in-memory graph map from storage during boot.
   * @param options Transient runtime knobs (e.g., historical offset bounds, read-isolation levels).
   */
  loadGraph(options?: Record<string, unknown>): Promise<GraphNodeMap>

  /**
   * Commits a transactional batch of processed nodes to the ledger at the end of a turn.
   * @param nodes The collection of dirty or newly committed nodes to write.
   * @param options Transaction levers (e.g., atomic commit flags, bypass cache markers).
   */
  commitBatch(nodes: GraphNode[], options?: Record<string, unknown>): Promise<void>
}
