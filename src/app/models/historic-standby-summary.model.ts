export interface HistoricStandbySummaryRequest {
  dateFrom: string;
  dateTo: string;
}

export interface HistoricStandbyWeather {
  iata: string;
  temperature: string;   // 注意：此 API 給的是 string
  weatherStatus: string;
  visibility: string;
  cloudLevel: string;
  windspeed: string;
}

export interface HistoricStandbyAirlineStat {
  airlineIATA: string;
  airlineName: string;
  regtotal: number;
  fetchuptotal: number;
  passtotal: number;
  flytotal: number;
  flyRate: number;
}

export interface HistoricStandbySummaryItem {
  destinationName: string;
  destinationId: string;
  currWeather: HistoricStandbyWeather;
  airlines: HistoricStandbyAirlineStat[];
}
