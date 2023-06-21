import { BrowserWindow, MessageBoxSyncOptions, dialog } from "electron";

export function prepLeave(mainWindow:BrowserWindow) {
  const options:MessageBoxSyncOptions = {
    type: 'question',
    buttons: ['Cancel', 'Leave'],
    message: 'Leave app?',
    detail: 'Reading progress made may not be saved.',
  };
    return function onLeave(event:Electron.Event) {
      const response = dialog.showMessageBoxSync(mainWindow, options)
      if (response === 1) event.preventDefault();
    };
}
