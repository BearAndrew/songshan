export interface IrregularAnalysisRequest {
  dateFrom: string;
  dateTo: string;
  type: string;       // ALL / SCHEDULED / COMM / OTHER (依後端定義)
  flightType: string;
  peer: string;
  airline: string;    // e.g. "CI"
}

export interface IrregularStatItem {
  label: string;

  AllNumOfFlight: number;
  AllNumOfPax: number;

  IrregularFlight: number;
  IrregularPax: number;

  IrregularRate: number;
  IrregularPaxRate: number;
}

export interface IrregularQueryData {
  stat: IrregularStatItem[];

  totalFlight: number;

  IrregularRate: number;
  OnTimeRate: number;

  IrregularPaxRate: number;

  IrregularFlightRate0: number;
  IrregularFlightRate30: number;
  IrregularFlightRate60: number;

  IrregularPaxRate0: number;
  IrregularPaxRate30: number;
  IrregularPaxRate60: number;
}

export interface IrregularAnalysisResponse {
  queryData: IrregularQueryData;
}
