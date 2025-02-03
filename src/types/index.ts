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
