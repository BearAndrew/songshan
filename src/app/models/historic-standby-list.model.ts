export interface HistoricStandbyListRequest {
  dateFrom: string;
  dateTo: string;
}

export interface HistoricStandbyListItem {
  date: string;
  flightNo: string;
  airlineName: string;
  departureTime: string;
  status: string;
  standbyOK: number;
}
