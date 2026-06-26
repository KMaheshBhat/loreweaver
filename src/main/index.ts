import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BaseNode } from '@engine/model'
import { ChromeNode, isSidebarNode } from '@engine/chrome/model'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

import { Intent, version } from '@hami-frameworx/core'
import { ledger } from '@engine/index'

const enableDevToolOnStart = false

/**
 * Creates the main application window with Electron configuration.
 *
 * @returns The configured BrowserWindow instance.
 */
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
  enableDevToolOnStart &&
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    })

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

  // Initialize the Deterministic Vessel (Empty)
  const l = ledger.bootstrap() // l = mixin-less ledger
  /*
  const lLedger = new Ledger() // lLedger = legacy ledger
  const chrome = new ChromeIncubate()
  const weaver = new WeaverIncubate() // The operational adaptor
  const glf = new GrittyLowFantasyIncubate()
  const hma = new HighMagicAcademyIncubate()
  const fss = new FSStoreIncubate({ rootDirectory: '.' })
  lLedger.addFlow(chrome)
  lLedger.addFlow(lLedger.createIdMintingFlow(new ChronoIDMintProvider(), [], { id: 'id-mint' }))
  lLedger.addFlow(lLedger.createRecordFlow(fss, [], { id: 'fs-record' }))
  loreChoice % 2 == 1 ? lLedger.addFlow(glf) : lLedger.addFlow(hma)
  lLedger.addFlow(weaver)
  const openRouterFree = {
    id: 'openrouter-free',
    options: {
      provider: 'openrouter',
      modelId: 'openrouter/free'
    }
  }
  const llamaCpp = {
    id: 'llama.cpp',
    options: {
      provider: 'llama.cpp',
      modelId: '',
      temperature: 1.0,
      top_p: 0.95,
      top_k: 20,
      min_p: 0.0,
      presence_penalty: 1.5,
      repetition_penalty: 1.0
    }
  }
  lLedger.addFlow(lLedger.createSynthesisFlow(new PiAiSynthesisProvider(), [], openRouterFree))
  lLedger.addFlow(lLedger.createSynthesisFlow(new PiAiSynthesisProvider(), [], llamaCpp))
  */

  // The Reactive Bridge (Forwarding Ledger events to UI) [8]
  const forward = (win: BrowserWindow): void => {
    l.on('node:created', (n) => win.webContents.send('node:created', n))
    l.on('node:updated', (n) => win.webContents.send('node:updated', n))
    l.on('node:removed', (n) => win.webContents.send('node:removed', n))
  }

  // On-Start Lifecycle: Trigger Genesis
  // At this stage, we instantiate our chosen 'Incubate' adapter and run the init workflow.
  const initIntent: Intent = {
    id: 'init-0',
    kind: 'init',
    nodes: [],
    options: { source: 'system' }
  }
  l.runFlow(initIntent)

  ipcMain.handle('client:node', async (): Promise<BaseNode | undefined> => {
    return l.getNode('client')
  })

  ipcMain.handle('chrome:nodes:sidebar', async (): Promise<ChromeNode[]> => {
    return l.getGraphNodes().filter(isSidebarNode)
  })

  ipcMain.handle('weaver:nodes', async (): Promise<BaseNode[]> => {
    return l.getGraphNodes().filter((node) => node.data.group.startsWith('weave'))
  })

  ipcMain.handle('weaver:submit', async (_event, nodes: BaseNode[]): Promise<void> => {
    const submitIntent: Intent = {
      id: `intent-submit-${Date.now()}`,
      kind: 'submit-turn',
      nodes: nodes,
      options: { source: 'client' }
    }
    await l.runFlow(submitIntent)
  })

  ipcMain.on('engine:chrome:exit', () => {
    app.quit()
  })

  const mainWindow = createWindow()
  forward(mainWindow)

  app.on('activate', function () {
    // On macOS, re-create a window when the dock icon is clicked
    // and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      const newWindow = createWindow()
      forward(newWindow)
    }
  })

  console.log(`HAMI ${version}`)
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
