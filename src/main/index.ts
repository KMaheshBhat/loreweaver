import { ASOIAFIncubate } from '@adaptor/incubate/asoiaf'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { Ledger } from '@engine/domain/ledger'
import { GraphNode } from '@engine/model/base'
import { ChromeNode, isSidebarNode } from '@engine/model/chrome'
import { Intent } from '@engine/model/intent'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { ChromeIncubate } from '@adaptor/incubate/chrome'

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // For DevTools on Start
  // mainWindow.webContents.openDevTools({
  //   mode: 'detach'
  // })

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 1. Initialize the Deterministic Vessel (Empty)
  const ledger = new Ledger()

  // 2. The Reactive Bridge (Forwarding Ledger events to UI) [8]
  const forward = (win: BrowserWindow): void => {
    ledger.on('node:created', (n) => win.webContents.send('node:created', n))
    ledger.on('node:updated', (n) => win.webContents.send('node:updated', n))
    ledger.on('node:removed', (n) => win.webContents.send('node:removed', n))
  }

  // 3. On-Start Lifecycle: Trigger Genesis
  // At this stage, we instantiate our chosen 'Incubate' adapter and run the init workflow.
  const chrome = new ChromeIncubate()
  const asoiaf = new ASOIAFIncubate()
  const initIntent: Intent = { id: 'init-0', kind: 'init', nodes: [], meta: {} }
  await ledger.runWorkflow(chrome, initIntent)
  await ledger.runWorkflow(asoiaf, initIntent)

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('client:node', async (): Promise<GraphNode | undefined> => {
    return ledger.getNode('client')
  })

  ipcMain.handle('chrome:nodes:sidebar', async (): Promise<ChromeNode[]> => {
    return ledger.getNodes().filter(isSidebarNode)
  })

  ipcMain.handle('weaver:nodes', async (): Promise<GraphNode[]> => {
    return ledger.getNodes().filter((node) => node.data.group === 'weave')
  })

  ipcMain.on('engine:chrome:exit', () => {
    // This allows future SQLite transaction buffers to flush naturally before closing the window handle
    app.quit()
  })

  const mainWindow = createWindow()
  forward(mainWindow)

  app.on('activate', function () {
    // On macOS, re-create a window when the dock icon is clicked
    // and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      // 1. Create the new window instance
      const newWindow = createWindow()
      // 2. Re-establish the Reactive Bridge for this specific instance [2]
      forward(newWindow)
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
