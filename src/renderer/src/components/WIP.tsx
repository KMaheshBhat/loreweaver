import { useUI } from '@renderer/context/UIContext'

export default function WIP(): React.JSX.Element {
  const { currentMode } = useUI()
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-surface-t1 custom-terminal-scroll p-12">
      {/* Category Alpha: Fallback / Invalid Layer UI */}
      <div className="p-8 decorator-alpha-active-focus bg-surface-t3 shadow-lg max-w-xl">
        <div className="font-bold mb-4 uppercase tracking-widest">
          {`// CAUSALITY BREACH: MODE [${currentMode?.toUpperCase()}] UNMAPPED`}
        </div>
        <p className="text-t3 mb-6">
          The reality for the {currentMode} has not yet been reconciled by the Loom. Causality
          Accounting for this domain is currently suspended in the Void.
        </p>
        <div className="text-t4 animate-pulse uppercase">
          {`Status: Error Code Alpha-001 — Kernel Entry Point Not Found`}
        </div>
      </div>
    </div>
  )
}
