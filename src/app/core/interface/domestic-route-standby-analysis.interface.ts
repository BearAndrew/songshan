import { HistoricStandbyAirlineStat } from "../../models/historic-standby-summary.model";

export interface WeatherInfo {
  temperature: string;
  description: string;
  visibility: string;
  altitude: string;
  windSpeed: string;
}

export interface FlightRow {
  route: string;
  weather: WeatherInfo;
  details: HistoricStandbyAirlineStat[]; // 3 筆 row
  maxReg?: number;
  maxFetchup?: number;
  maxPass?: number;
  maxFly?: number;
  maxFlyRate?: number;
  routerParam: string;
}
