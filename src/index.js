const { app, BrowserWindow, Menu, globalShortcut, screen, ipcMain } = require("electron");

let mainWindow;
let alwaysOnTop = true; // Default state

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay(); // Get main monitor info
  const { width, height } = primaryDisplay.workAreaSize; // Get usable screen area

  mainWindow = new BrowserWindow({
    width: 200,
    height: 110,
    opacity: 1,
    transparent: true, // Makes the window transparent
    hasShadow: false, // Removes the shadow
    resizable: false, // Prevents resizing the window
    frame: false, // Hides the entire window frame, including buttons
    y: 0,
    x: width - 250,
    alwaysOnTop: alwaysOnTop, // Set window to always be on top
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Remove default menu bar
  Menu.setApplicationMenu(null);

  // Register a global shortcut to toggle always-on-top
  globalShortcut.register("Ctrl+Shift+T", () => {
    alwaysOnTop = !alwaysOnTop;
    mainWindow.setAlwaysOnTop(alwaysOnTop);
    console.log(`Always on top: ${alwaysOnTop}`);
  });
  
  // Register a global shortcut to close application
  globalShortcut.register("Ctrl+Shift+Alt+C", () => {
    app.quit();
  });

  mainWindow.loadFile("src/index.html");
 // Allow mouse to click through the window
  mainWindow.setIgnoreMouseEvents(true);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

// Unregister shortcuts when the app is quitting
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// Listen for close request from renderer process
ipcMain.on("close-app", () => {
  app.quit(); // Quits the entire app
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.whenReady().then(() => {
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
        },
      });

      mainWindow.loadFile("src/index.html");
    });
  }
});
