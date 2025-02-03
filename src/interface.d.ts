import { IFetchBCBArguments } from './types';

export interface IElectronAPI {
  fetchBCB: (data: IFetchBCBArguments) => Promise<number>;
  onUpdateCounter: (callback: (value: number) => void) => void;
  counterValue: (value: number) => void;
}

declare global {
  interface Window {
    versions: IVersionsAPI;
    electronAPI: IElectronAPI;
  }
}
