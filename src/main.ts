import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { appUpdater, bcbScrap } from './functions';
import { IFetchBCBArguments } from './types';

const electronPath = path.join(__dirname, '../_electron/');
let win: BrowserWindow;

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
          label: 'Sair',
          click: () => app.quit(),
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  win.loadFile(electronPath + 'static/index.html');

  return win;
};

app.whenReady().then(() => {
  win = createWindow();

  const updater = appUpdater(win);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow();
    }
  });

  ipcMain.handle('fetchBCB', async (_event, data: IFetchBCBArguments) => {
    const req = await bcbScrap(data);

    if (req) {
      return req;
    }

    throw new Error('Falha ao buscar os dados no Banco Central.');
  });

  ipcMain.on('close-app', () => app.quit());
  ipcMain.on('get-app-version', () =>
    win.webContents.send('check-version', app.getVersion())
  );
  ipcMain.on('quit-and-update', () => updater.quitAndInstall());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
