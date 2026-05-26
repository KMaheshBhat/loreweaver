import Accounting from './Accounting'
import Context from './Context'
import Sidebar from './Sidebar'
import Tapestry from './Tapestry'

function Chrome(): React.JSX.Element {
  return (
    <>
      {/* Root Container: Full dark chrome canvas background & base layout sizing */}
      <div className="flex h-screen w-screen bg-surface-t1 font-sans overflow-hidden select-none">
        <Sidebar />
        {/* Main Work Area: Multi-column view tethered with raw vertical rules */}
        <div className="flex-1 flex flex-row min-w-[600px]">
          {/* Left Column (25% width proportional) */}
          <Context />
          {/* Middle Column / Workspace (50% width proportional) */}
          <Tapestry />
          {/* Right Column (25% width proportional) */}
          <Accounting />
        </div>
      </div>
    </>
  )
}

export default Chrome
