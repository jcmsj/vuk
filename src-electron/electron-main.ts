import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import { prepLeave } from './prepLeave';
import { prepIPC } from './ipc';
import { prepDev } from './prepDev';
import Store from 'electron-store';
import { WebContents } from 'electron';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

/**
 * @see https://github.com/electron/electron/issues/526#issuecomment-1375534548
 */
function rememberWindowState(w: BrowserWindow) {
  const store = new Store<{ bounds?: Electron.Rectangle }>()
  const b = store.get('bounds');
  if (b) {
    w.setBounds(b)
  } else {
    w.maximize()
  }

  w.on('close', () => {
    store.set('bounds', w.getBounds())
  })
}

/**
 * Restore pinch zoom
 */
function addZoom(c: WebContents) {
  c.setVisualZoomLevelLimits(1, 3);
  c.on("zoom-changed", (_, direction) => {
    c.zoomFactor += 0.2 * (direction == "in" ? 1 : -1);
  })
}
try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) { }

export let mainWindow: BrowserWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });
  rememberWindowState(mainWindow);
  mainWindow.loadURL(process.env.APP_URL);

  prepDev(mainWindow);
  prepIPC();
  mainWindow.webContents.on('will-prevent-unload', prepLeave(mainWindow));
  addZoom(mainWindow.webContents)

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
