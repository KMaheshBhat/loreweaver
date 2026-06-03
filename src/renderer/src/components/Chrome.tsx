import { useUI } from '@renderer/context/UIContext'
import Sidebar from './Sidebar'
import Context from './Context'
import Tapestry from './Tapestry'
import Accounting from './Accounting'
import WIP from './WIP'

export default function Chrome(): React.JSX.Element {
  const { currentMode, focusedColumn } = useUI()

  /**
   * Geometric Logic: Resolve widths based on the Mini Hub focus.
   * Expansion to 50% (w-1/2) provides the "Microscope" lens for the active task [4, 5].
   */
  const getColWidth = (col: 'context' | 'tapestry' | 'accounting'): string => {
    // If this column is focused, it takes priority
    if (focusedColumn === col) return 'w-1/2'

    // Default fallback: Tapestry is the primary workspace if no focus is set
    if (!focusedColumn && col === 'tapestry') return 'w-1/2'

    // Otherwise, contract to the 25% baseline
    return 'w-1/4'
  }

  // Base Transition Style: Cinematic layout shifts distinguish macro geometry from micro card glows
  const colBaseStyle =
    'h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden layout-t2-see-through'

  return (
    <div className="flex h-screen w-full bg-surface-t1 text-t2 font-sans overflow-hidden">
      {/* Column 1: Chrome Selector (System Frame) [1, 2] */}
      <Sidebar />

      <main className="flex flex-1 h-full overflow-hidden">
        {currentMode === 'weaver' ? (
          <>
            {/* Column 3: Motivation (Context & Inspection) [1, 6] */}
            <div className={`${getColWidth('context')} ${colBaseStyle}`}>
              <Context />
            </div>

            {/* Column 4: Specification (The Weave & Forge) [1, 6] */}
            <div className={`${getColWidth('tapestry')} ${colBaseStyle}`}>
              <Tapestry />
            </div>

            {/* Column 5: Gratification (Causality Accounting) [1, 6] */}
            <div className={`${getColWidth('accounting')} ${colBaseStyle} border-r-0`}>
              <Accounting />
            </div>
          </>
        ) : (
          /* Routing for Keeper and Settings: The "Soon To Come" Breach */
          <WIP />
        )}
      </main>
    </div>
  )
}
