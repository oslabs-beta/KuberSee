const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 500,
      minHeight: 400,
      maxHeight: 800,
      minWidth: 400,
        maxWidth: 1500,

    });
    win.loadURL("http://localhost:8080");
    // win.loadFile("index.html");
};
app.whenReady().then(() => {
    createWindow()
//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
})
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
