import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { bcbScrap, appUpdater } from './functions';
import { IFetchBCBArguments } from './types';
import 'dotenv/config';

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

  win.loadFile(electronPath + 'static/index.html');
  win.webContents.openDevTools();

  return win;
};

app.on('ready', () => {
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

  if (BrowserWindow.getAllWindows().length === 0) {
    const win = createWindow();

    const updater = appUpdater(win);

    updater.checkForUpdates();
  }
});

app.on('window-all-closed', () => {
  console.log('chamou onwindow-all-closed');

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
