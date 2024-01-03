import { BrowserWindow, app } from "electron";

export function prepDev(mainWindow: BrowserWindow) {
  // if (process.env.DEBUGGING) {
  //   if on DEV or Production with debug enabled
  //   Note: Can't use static import as it fails in prod 
  //   if (!app.isPackaged) {
  //     import("electron-devtools-installer").then(({ default: installExtension, VUEJS_DEVTOOLS }) => {
  //       installExtension(VUEJS_DEVTOOLS)
  //         .then(name => console.log(`Added Extension:  ${name}`))
  //         .catch(err => console.log('An error occurred: ', err));
  //     })
  //   }
  //   return
  // }

  // we're on production; no access to devtools pls
  mainWindow.webContents.on('devtools-opened', mainWindow?.webContents.closeDevTools);
}
