export interface IFetchBCBArguments {
  codSegmento: string;
  codModalidade: string;
  tipoModalidade: string;
  periodo: string;
}

export interface IForm {
  startDate: string;
  financingType: number;
  contractRate: number;
}

export type GenericObject = {
  [key: string]: string;
};

export interface IUpdaterObject {
  tag: string;
  version: string;
  files: Array<{
    url: string;
    sha512: string;
    size: number;
    blockMapSize: 120326;
  }>;
  path: string;
  sha512: string;
  releaseDate: string;
  releaseName: string;
  releaseNotes: string;
}

export interface IElectronAPI {
  fetchBCB: (data: IFetchBCBArguments) => Promise<number>;
  getAppVersion: () => void;
  onUpdate: (cb: (details: IUpdaterObject) => void) => void;
  onMessage: (cb: (message: string) => void) => void;
  quitApp: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
