import { contextBridge, ipcRenderer } from 'electron';
import { IFetchBCBArguments, IUpdaterObject } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchBCB: (data: IFetchBCBArguments) => ipcRenderer.invoke('fetchBCB', data),
  onUpdate: (cb: (details: IUpdaterObject) => void) =>
    ipcRenderer.on('check-update', (evt, detais) => cb(detais)),
  onMessage: (cb: (message: string) => void) =>
    ipcRenderer.on('message', (evt, message) => cb(message)),
  quitApp: () => ipcRenderer.send('close-app'),
});
