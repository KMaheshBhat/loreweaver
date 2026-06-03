import { useUI } from '@renderer/context/UIContext'
import Accounting from './Accounting'
import Context from './Context'
import Sidebar from './Sidebar'
import Tapestry from './Tapestry'
import WIP from './WIP'

function Chrome(): React.JSX.Element {
  const { currentMode } = useUI()
  return (
    <>
      {/* Root Container: Full dark chrome canvas background & base layout sizing */}
      <div className="flex h-screen w-screen bg-surface-t1 font-sans overflow-hidden select-none">
        <Sidebar />
        {currentMode === 'weaver' ? (
          <div className="flex-1 flex flex-row min-w-150">
            <Context />
            <Tapestry />
            <Accounting />
          </div>
        ) : (
          <WIP />
        )}
      </div>
    </>
  )
}

export default Chrome
