import { contextBridge, ipcRenderer } from 'electron';
import { IFetchBCBArguments } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchBCB: (data: IFetchBCBArguments) => ipcRenderer.invoke('fetchBCB', data),
  onUpdateCounter: (callback: (value: number) => void) => {
    return ipcRenderer.on('update-counter', (_event, value) => callback(value));
  },
  counterValue: (value: number) => ipcRenderer.send('counter-value', value),
});
