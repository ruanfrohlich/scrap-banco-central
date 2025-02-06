import { BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';

export const appUpdater = (win: BrowserWindow) => {
  const updater = autoUpdater;

  updater.checkForUpdates();

  updater.on('update-available', (info) => {
    updater.on('update-downloaded', () =>
      win.webContents.send('check-update', info)
    );
  });

  return updater;
};
