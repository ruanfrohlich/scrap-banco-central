import { contextBridge, ipcRenderer, app } from 'electron';
import { IFetchBCBArguments } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchBCB: (data: IFetchBCBArguments) => ipcRenderer.invoke('fetchBCB', data),
  onUpdateCounter: (callback: (value: number) => void) => {
    return ipcRenderer.on('update-counter', (_event, value) => callback(value));
  },
  counterValue: (value: number) => ipcRenderer.send('counter-value', value),
  getAppVersion: () => ipcRenderer.send('app-version'),
  appVersion: (cb: (version: string) => void) =>
    ipcRenderer.on('check-version', (evt, value) => cb(value)),
});
