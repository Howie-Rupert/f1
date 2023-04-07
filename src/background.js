'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    title: "登录",
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION

    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  ipcMain.on('message', (event, userinfo) => {
    win.webContents.send('message', userinfo);
  });
  ipcMain.on("Login", e => {
    win.setSize(300, 400)
  })
  ipcMain.on("LoginSuccess", e => {
    win.setSize(1050, 700)
  })
  ipcMain.on("minimize", e => {
    win.minimize()
  })
  ipcMain.on("closeWindow", e => {
    app.exit()
  })
  ipcMain.on('close', e => {
    e.sender.destroy()
  })
  ipcMain.on("closeWindowMain", e => {
    app.exit()
  })
  ipcMain.on("restart", e => {
    app.relaunch();
    app.exit()
  })
  ipcMain.on('newwindow', function (e, arg) {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:8080`
      : `file://${__dirname}/index.html`
    // http://localhost:8080 可根据自己项目运行端口配置
    var newWin = ''
    if (newWin) {
      newWin.focus()
      return
    }
    newWin = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: "详细资源",
      frame: false,
      fullscreen: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        webSecurity: false
      }
    })
    newWin.loadURL(winURL + '#/SourceDetail')
    newWin.on('ready-to-show', function () {
      newWin.show()
    })
    setTimeout(() => {
      newWin.webContents.send("infomation", arg)
    }, 2000)
    newWin.on('close', () => {
      console.log('close')
      newWin = null
    })
  })
  ipcMain.on('addfriend', function (e, arg) {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:8080`
      : `file://${__dirname}/index.html`
    // http://localhost:8080 可根据自己项目运行端口配置
    var newWin = ''
    if (newWin) {
      newWin.focus()
      return
    }
    newWin = new BrowserWindow({
      width: 1000,
      height: 800,
      frame: false,
      title: "详细资源",
      fullscreen: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        webSecurity: false
      }
    })
    newWin.loadURL(winURL + '#/Addfriend')
    newWin.on('ready-to-show', function () {
      newWin.show()
    })
    setTimeout(() => {
      newWin.webContents.send("getUserid", arg)
    }, 2000)
    newWin.on('close', () => {
      console.log('close')
      newWin = null
    })
  })
  ipcMain.on('groupAdd', function (e, arg) {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:8080`
      : `file://${__dirname}/index.html`
    // http://localhost:8080 可根据自己项目运行端口配置
    var newWin = ''
    if (newWin) {
      newWin.focus()
      return
    }
    newWin = new BrowserWindow({
      width: 600,
      height: 400,
      title: "创建群组",
      resizable: true,
      frame: false,
      fullscreen: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        webSecurity: false
      }
    })

    newWin.loadURL(winURL + '#/GroupAdd')
    newWin.on('ready-to-show', function () {
      newWin.show()
    })
    setTimeout(() => {
      newWin.webContents.send("getUserid", arg)
    }, 2000)
    newWin.on('close', () => {
      console.log('close')
      newWin = null
    })
  })
  ipcMain.on('shenqing', function (e, arg) {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:8080`
      : `file://${__dirname}/index.html`
    // http://localhost:8080 可根据自己项目运行端口配置
    var newWin = ''
    if (newWin) {
      newWin.focus()
      return
    }
    newWin = new BrowserWindow({
      width: 800,
      height: 600,
      title: "详细资源",
      frame: false,
      fullscreen: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        webSecurity: false
      }
    })

    newWin.loadURL(winURL + '#/Shenqing')
    newWin.on('ready-to-show', function () {
      newWin.show()
    })
    setTimeout(() => {
      newWin.webContents.send("getUserid", arg)
    }, 2000)
    newWin.on('close', () => {
      console.log('close')
      newWin = null
    })
  })
  ipcMain.on('myinfo', function (e, arg) {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:8080`
      : `file://${__dirname}/index.html`
    // http://localhost:8080 可根据自己项目运行端口配置
    var newWin = ''
    if (newWin) {
      newWin.focus()
      return
    }
    newWin = new BrowserWindow({
      width: 600,
      title: "详细资源",
      height: 700,
      frame: false,
      fullscreen: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        webSecurity: false
      }
    })
    newWin.loadURL(winURL + '#/MyInfo')
    newWin.on('ready-to-show', function () {
      newWin.show()
    })
    setTimeout(() => {
      newWin.webContents.send("getUserid", arg)
    }, 2000)
    newWin.on('close', () => {
      console.log('close')
      newWin = null
    })
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
