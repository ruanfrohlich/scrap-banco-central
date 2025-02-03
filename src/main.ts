import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { bcbScrap } from './functions';
import { IArguments } from './types';

const electronPath = path.join(__dirname, '../electron/');
const isDev = process.env.NODE_ENV !== 'production';

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

  isDev
    ? win.loadURL('http://localhost:3000')
    : win.loadFile(electronPath + 'static/index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.handle('fetchBCB', async (event, data: IArguments) => {
  const req = await bcbScrap(data);

  if (req) {
    return req;
  }

  throw new Error('Falha ao buscar os dados no Banco Central.');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
