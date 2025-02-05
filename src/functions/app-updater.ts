import { BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';

export const appUpdater = (win: BrowserWindow, isDev: boolean) => {
  autoUpdater.checkForUpdates();

  autoUpdater.on('checking-for-update', () => {
    win.webContents.send('message', 'Checando atualizações...');
  });

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('check-update', info);
  });
};
