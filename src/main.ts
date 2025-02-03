import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { bcbScrap } from './functions';
import { IFetchBCBArguments } from './types';

const electronPath = path.join(__dirname, '../_electron/');

const createWindow = () => {
  const win = new BrowserWindow({
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
          click: () => win.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'Decrement',
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
  win.loadFile(electronPath + 'static/index.html');
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
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
