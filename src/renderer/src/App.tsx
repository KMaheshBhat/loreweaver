import Versions from './components/Versions'
import { Node } from './components/Node'
// import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      {/* Root Container: Full dark chrome canvas background & white base text */}
      <div className="flex h-screen w-screen bg-chrome text-white overflow-hidden select-none">
        {/* Leftmost Navigation Sidebar (Chrome Surface variant) */}
        <aside className="w-48 bg-chrome-surface flex-shrink-0 flex flex-col border-r border-chrome-border">
          <div className="px-6 pt-6 font-bold text-xl text-white text-glow">LoreWeaver</div>
          <div className="px-6 font-bold text-xs text-accent">the Loom Throne</div>
          <nav className="mt-4 flex-1">
            <a
              href="#"
              className="block py-2 px-6 hover:bg-chrome/50 text-white/90 hover:text-white"
            >
              Weaver
            </a>
            <a
              href="#"
              className="block py-2 px-6 hover:bg-chrome/50 text-white/90 hover:text-white"
            >
              Keeper
            </a>
            <a
              href="#"
              className="block py-2 px-6 hover:bg-chrome/50 text-white/90 hover:text-white"
            >
              Settings
            </a>
          </nav>
          <Versions />
        </aside>

        {/* Main Work Area: Multi-column view tethered with raw vertical rules */}
        <div className="flex-1 flex flex-row min-w-[600px]">
          {/* Left Column (25% width proportional) */}
          <div className="w-1/4 flex flex-col border-r border-chrome-border overflow-y-auto p-4">
            <h2 className="font-bold mb-2 text-accent">Context</h2>
            <p className="text-sm text-white/70 truncate">Keeps 25% width.</p>
            <p className="text-sm text-white/70 truncate text-accent">System Instructions</p>
            <p className="text-sm text-white/70 truncate text-accent">Character #1</p>
            <p className="text-sm text-white/70 truncate text-accent">Character #2</p>
            <p className="text-sm text-white/70 truncate text-accent">Scenario</p>
            <p className="text-sm text-white/70 truncate text-accent">Summary #1</p>
            <p className="text-sm text-white/70 truncate text-accent">Summary #2</p>
            <p className="text-sm text-white/70 truncate text-accent">Summary #3</p>
          </div>

          {/* Middle Column / Workspace (50% width proportional) */}
          <div className="w-1/2 flex flex-col border-r border-chrome-border h-full">
            {/* Scrollable content feed area */}
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="font-bold mb-2 text-white text-shadow-xl shadow-sky-400">
                The Weave - Tapestry
              </h2>
              <p className="text-sm text-white/70 mb-4">
                Keeps 50% width. Double the size of the sides.
              </p>
              <ul>
                <Node id={75} content="The narrative begins to unfold..." />
                <Node id={76} content="Tension rises as events escalate." />
                <Node id={77} content="A pivotal moment changes everything." active />
              </ul>
            </div>

            {/* Bottom-anchored Mock Multi-line Input Wrapper */}
            <div className="border-t border-chrome-border p-4 bg-chrome-surface/30">
              <div className="relative overflow-hidden bg-chrome-surface border border-chrome-border">
                {/* 1. Text Layer */}
                <div className="w-full min-h-[80px] p-3 text-accent text-sm whitespace-pre-wrap cursor-text rounded-none focus:outline-none selection:bg-accent/20">
                  [Mock Multi-line Input Box Area] <br />
                  Type your narrative commit or prompt here... (drafting Turn#79)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (25% width proportional) */}
          <div className="w-1/4 flex flex-col overflow-y-auto p-4">
            <h2 className="font-bold mb-2 text-white/90">Causality Accounting</h2>
            <p className="text-sm text-white/70 truncate">Keeps 25% width.</p>
            <ul>
              <li>Result #76-1</li>
              <li>Result #76-2</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
