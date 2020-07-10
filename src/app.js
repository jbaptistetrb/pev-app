const {
  app,
  ipcMain,
  session,
  BrowserWindow,
  Menu,
} = require("electron")
const fs = require("fs")
const path = require("path")


function addMenu(platform) {
  let menu = Menu.buildFromTemplate([{
      label: "Home",
      submenu: [{
          role: "about"
        },
        {
          type: "separator"
        },
        {
          label: "Services",
          submenu: []
        },
        {
          type: "separator"
        },
        {
          role: "hide"
        },
        {
          role: "hideOthers"
        },
        {
          role: "unhide"
        },
        {
          type: "separator"
        },
        {
          role: "quit"
        },
      ]
    },
    {
      label: "Edit",
      submenu: [{
          role: "undo"
        },
        {
          role: "redo"
        },
        {
          type: "separator"
        },
        {
          role: "cut"
        },
        {
          role: "copy"
        },
        {
          role: "paste"
        }
      ]
    }, {
      label: "View",
      submenu: [{
          role: "reload"
        },
        {
          role: "toggledevtools"
        },
        {
          type: "separator"
        },
        {
          role: "resetzoom"
        },
        {
          role: "zoomin"
        },
        {
          role: "zoomout"
        },
        {
          type: "separator"
        },
        {
          role: "togglefullscreen"
        }
      ]
    }, {
      role: "window",
      submenu: [{
          role: "minimize"
        },
        {
          role: "close"
        }
      ]
    }, {
      role: "help",
      submenu: [{
        label: "Learn More"
      }]
    }
  ])

  if (platform == "darwin") {
    Menu.setApplicationMenu(menu)
  } else {
    Menu.setApplicationMenu(null)
  }
}


function createWindow() {

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    titleBarStyle: "hiddenInset",
    icon: path.join(__dirname, "../build/icons/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  // Open the devtools
  // mainWindow.openDevTools()

  // Load the app
  mainWindow.loadURL(`file://${__dirname}/pev/index.html`)

  // On ipcEvent...
  ipcMain.on("contextmenu:open", function (event, x, y) {
    let contextmenu = Menu.buildFromTemplate([{
        role: "undo"
      },
      {
        role: "redo"
      },
      {
        type: "separator"
      },
      {
        role: "cut"
      },
      {
        role: "copy"
      },
      {
        role: "paste"
      },
      {
        type: "separator"
      },
      {
        label: "Advanced",
        submenu: [{
            role: "reload"
          },
          {
            role: "toggledevtools"
          },
        ]
      }
    ])
    contextmenu.popup({
      window: mainWindow,
      x,
      y
    })
  })

  if (process.platform == "darwin") {
    app.on("activate-with-no-open-windows", function () {
      mainWindow.show()
    })
  }

  // Emitted when the window is closed.
  mainWindow.on("close", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (process.platform != "darwin") {
      mainWindow = null
    } else {
      mainWindow.hide()
    }
  })
}


// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null

// Add menu
addMenu(process.platform)

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  app.quit()
})

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on("ready", createWindow)
