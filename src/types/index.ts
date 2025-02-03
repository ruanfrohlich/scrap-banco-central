export interface IArguments {
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

export interface TWindow extends Window {
  [key: string]: any;
  versions: {
    [key: string]: () => string;
  };
}

export type GenericObject = {
  [key: string]: string;
};
