import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-indigo-700 text-white flex-shrink-0">
          <div className="p-6 font-bold text-xl">LoreWeaver</div>
          <nav className="mt-4">
            <a href="#" className="block py-2 px-6 hover:bg-indigo-600">
              Dashboard
            </a>
            <a href="#" className="block py-2 px-6 hover:bg-indigo-600">
              Settings
            </a>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow h-64">Column 1 Content</div>
            <div className="bg-white p-4 rounded shadow h-64">Column 2 Content</div>
            <div className="bg-white p-4 rounded shadow h-64">Column 3 Content</div>
          </div>
        </main>
      </div>

      <div className="text-2xl">
        <code>LoreWeaver</code>
        <code>v0.1.0</code>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
