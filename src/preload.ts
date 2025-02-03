import { contextBridge, ipcRenderer } from 'electron';
import { IFetchBCBArguments } from './types';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('fetchBCB', {
  fetch: (data: IFetchBCBArguments) => ipcRenderer.invoke('fetchBCB', data),
});
