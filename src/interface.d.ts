import { IFetchBCBArguments } from './types';

export interface IElectronAPI {
  fetchBCB: (data: IFetchBCBArguments) => Promise<number>;
  onUpdateCounter: (cb: (value: number) => void) => void;
  counterValue: (value: number) => void;
  getAppVersion: () => void;
  appVersion: (cb: (version: string) => void) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
