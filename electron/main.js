const { app, BrowserWindow } = require('electron');
const path = require("path");
const url = require("url");


// const createWindow = () => {
//     win = new BrowserWindow({
//       width: 800,
//       height: 500,
//       minHeight: 400,
//       maxHeight: 800,
//       minWidth: 400,
//         maxWidth: 1500,

//     });
//     // win.loadURL("http://localhost:8080");
//     win.loadFile("index.html");
// };
function createWindow() {
     mainWindow = new BrowserWindow({
          width: 1100,
          height: 800,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      // Set the path of an additional "preload" script that can be used to
      // communicate between node-land and browser-land.
      webPreferences: {
        nodeIntegration: true,
              contextIsolation: false,
      },
    });
    const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:8080";

  mainWindow.loadURL(appURL);

  mainWindow.once('ready-to-show', () => {
		mainWindow.show()
  });
  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}
// // Setup a local proxy to adjust the paths of requested files when loading
// // them from the local production bundle (e.g.: local fonts, etc...).
// function setupLocalFilesNormalizerProxy() {
//     protocol.registerHttpProtocol(
//       "file",
//       (request, callback) => {
//         const url = request.url.substr(8);
//         callback({ path: path.normalize(`${__dirname}/${url}`) });
//       },
//       (error) => {
//         if (error) console.error("Failed to register protocol");
//       }
//     );
// }
  



// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    // setupLocalFilesNormalizerProxy();
  
    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
});




app.whenReady().then(() => {
    createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
