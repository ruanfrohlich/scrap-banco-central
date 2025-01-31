import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { bcbScrap } from './functions';
import { IArguments } from './types';

const electronPath = path.join(__dirname, '../electron/');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: electronPath + 'preload.js',
    },
  });

  win.loadFile(electronPath + 'static/index.html');
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
  console.log(data);

  const req = await bcbScrap(data);

  return req;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
