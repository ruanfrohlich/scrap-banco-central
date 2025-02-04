import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { bcbScrap } from './functions';
import { IFetchBCBArguments } from './types';
import { autoUpdater } from 'electron-updater';
import 'dotenv/config';

const electronPath = path.join(__dirname, '../_electron/');

let win: BrowserWindow | null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    maximizable: true,
    center: true,
    icon: '../images/logo.ico',
    roundedCorners: true,
    webPreferences: {
      preload: electronPath + 'preload.js',
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'BCB Interest Check',
      submenu: [
        {
          click: () => win?.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => win?.webContents.send('update-counter', -1),
          label: 'Decrement',
        },
        {
          label: 'Sobre',
          role: 'about',
        },
        {
          label: 'Sair',
          click: () => app.quit(),
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  win.on('closed', () => {
    win = null;
  });

  win.loadFile(electronPath + 'static/index.html');
  win.webContents.openDevTools();
};

function sendStatusToWindow(text: string) {
  console.log(text);
  win?.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message =
    log_message +
    ' (' +
    progressObj.transferred +
    '/' +
    progressObj.total +
    ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();

  ipcMain.handle('fetchBCB', async (_event, data: IFetchBCBArguments) => {
    const req = await bcbScrap(data);

    if (req) {
      return req;
    }

    throw new Error('Falha ao buscar os dados no Banco Central.');
  });

  ipcMain.on('counter-value', (_event, value: number) => {
    console.log(value);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
