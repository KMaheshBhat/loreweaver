import Sidebar from './Sidebar'

function Chrome(): React.JSX.Element {
  return (
    <>
      {/* Root Container: Full dark chrome canvas background & base layout sizing */}
      <div className="flex h-screen w-screen bg-surface-t1 font-sans overflow-hidden select-none">
        <Sidebar />
        {/* Main Work Area: Multi-column view tethered with raw vertical rules */}
        <div className="flex-1 flex flex-row min-w-[600px]">
          {/* Left Column (25% width proportional) */}
          <div className="w-1/4 flex flex-col border-r border-transparent layout-t2-see-through overflow-y-auto p-4">
            <h2 className="text-t1 text-accent mb-2">󰛡 Context</h2>
            <p className="text-t3 truncate mb-2">Keeps 25% width.</p>
            <p className="text-t3 truncate text-accent">󰋘 System Instructions</p>
            <p className="text-t3 truncate text-accent">󰋘 Character #1</p>
            <p className="text-t3 truncate text-accent">󰋘 Character #2</p>
            <p className="text-t3 truncate text-accent">󰋘 Scenario</p>
            <p className="text-t3 truncate text-accent">󰋘 Summary #1</p>
            <p className="text-t3 truncate text-accent">󰋘 Summary #2</p>
            <p className="text-t3 truncate text-accent">󰋘 Summary #3</p>
          </div>
          {/* Middle Column / Workspace (50% width proportional) */}
          <div className="w-1/2 flex flex-col border-r border-transparent layout-t2-see-through h-full">
            {/* Scrollable content feed area */}
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-t1 mb-2">󰛡 The Weave - Tapestry</h2>
              <p className="text-t3 mb-4">Keeps 50% width. Double the size of the sides.</p>
              <ul>
                <li className="p-3 mb-2 bg-surface-t3 rounded transition-all duration-300 decorator-beta-blur">
                  <div className="text-t4 mb-1">󰋘 Turn #75</div>
                  <div className="text-t3">The narrative begins to unfold...</div>
                </li>
                <li className="p-3 mb-2 bg-surface-t3 rounded transition-all duration-300 decorator-beta-blur">
                  <div className="text-t4 mb-1">󰋘 Turn #76</div>
                  <div className="text-t3">Tension rises as events escalate.</div>
                </li>
                {/* Raw Mock Block matching the evaluated execution of <Node active={true}> */}
                <li className="p-3 mb-2 bg-surface-t3 rounded transition-all duration-300 decorator-beta-focus">
                  <div className="text-t4 mb-1">󰋘 Turn #77</div>
                  <div className="text-t3">Anthar&apos;s gaze lingers on the ledger layout...</div>
                </li>
              </ul>
            </div>
            {/* Bottom-anchored Mock Multi-line Input Wrapper */}
            <div className="border-t border-transparent layout-t2-see-through p-4 bg-surface-t2-panel/30">
              <div className="relative overflow-hidden bg-surface-t2-panel border border-transparent layout-t2-see-through">
                {/* 1. Text Layer */}
                <div className="w-full min-h-[80px] p-3 text-t3 whitespace-pre-wrap cursor-text rounded-none focus:outline-none decorator-delta-focus">
                  󰋙 [Mock Multi-line Input Box Area] <br />
                  Type your narrative commit or prompt here... (drafting Turn#79)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (25% width proportional) */}
          <div className="w-1/4 flex flex-col overflow-y-auto p-4">
            <h2 className="text-t1 mb-2">󰛡 Causality Accounting</h2>
            <p className="text-t3 truncate mb-2">Keeps 25% width.</p>
            <ul className="text-t3">
              <li>󰋘 Result #76-1</li>
              <li>󰋘 Result #76-2</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chrome
