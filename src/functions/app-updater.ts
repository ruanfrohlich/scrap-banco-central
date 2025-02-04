import { BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';

export const appUpdater = (win: BrowserWindow) => {
  const appAutoUpdater = autoUpdater;

  appAutoUpdater.forceDevUpdateConfig = true;

  appAutoUpdater.on('checking-for-update', () => {
    win.webContents.send('message', 'Checando atualizações...');
  });

  appAutoUpdater.on('update-available', (info) => {
    win.webContents.send('message', info);
  });

  appAutoUpdater.on('update-not-available', (info) => {
    win.webContents.send('message', info);
  });

  appAutoUpdater.on('error', (err) => {
    win.webContents.send('message', err);
  });

  appAutoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('message', progressObj);
  });

  appAutoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('message', info);

    appAutoUpdater.quitAndInstall();
  });

  return appAutoUpdater;
};
