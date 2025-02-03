import { IFetchBCBArguments } from "./types";

export interface IVersionsAPI {
  [key: string]: () => string;
}

export interface IFetchBCB {
  fetch: (data: IFetchBCBArguments) => Promise<number>;
}

declare global {
  interface Window {
    versions: IVersionsAPI;
    fetchBCB: IFetchBCB;
  }
}
