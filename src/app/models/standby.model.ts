export interface StandbyWeather {
  iata: string;
  temperature: number;
  weatherStatus: string;
  visibility: string;
  cloudLevel: string;
  windspeed: string;
}

export interface StandbyAirlineSummary {
  airlineIATA: string;
  airlineName: string;
  standby_Reg: number | string;
  standby_FlightRemain: number | string;
  pax_Departed: number | string;
  standby_OK: number | string;
}

/** GetStandbySummary/{Airport} 單一目的地 */
export interface StandbySummaryItem {
  destinationName: string;
  currWeather: StandbyWeather;
  airlines: StandbyAirlineSummary[];
  totalStandbyReg: number;
  currStandby: number;
  total_FlightRemain: number;
  total_PaxDeparted: number;
  total_StandbyOK: number;
}

export interface StandbyListItem {
  flightNo: string;
  airlineName: string;
  departureTime: string;
  status: string;
  standbyOK: number;
}
