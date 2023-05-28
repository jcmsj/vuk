import { BrowserWindow } from "electron";
import installExtension, { VUEJS_DEVTOOLS} from 'electron-devtools-installer';

export function prepDev(mainWindow:BrowserWindow) {
    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools();
        installExtension(VUEJS_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
      } else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on('devtools-opened', mainWindow?.webContents.closeDevTools);
      }
}