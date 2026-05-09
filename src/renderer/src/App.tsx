import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="text">
        <code>LoreWeaver</code>
        <code>v0.1.0</code>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
