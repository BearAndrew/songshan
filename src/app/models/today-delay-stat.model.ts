import { TrafficSummary } from './traffic-summary.model';

export interface DelayAirline {
  iata: string;
  numOfFlight: number;
  numOfPax: number;
  avgDelay: number;
}

export interface DelayFlight {
  flightNo: string;
  airport: string;
  airportName: string;
  schTime: string;
  pax: string;
  reason: string;
  status: string;
}

export interface TopDelayAirport {
  iata: string;
  name_zhTW: string;
  estimateFlight: number;
  estimatePax: number;
  actualFlight: number;
  actualPax: number;
}

export interface DelayStat {
  outBound0: number;
  outBound30: number;
  outBound60: number;
  inBound0: number;
  inBound30: number;
  inBound60: number;
  outBoundFlights: number;
  outBoundPax: number;
  outBoundAvg: number;
  inBoundFlights: number;
  inBoundPax: number;
  inBoundAvg: number;
}

export interface StatByHour {
  hour: string;
  numOfFlight: number;
  numOfPax: number;
}

export interface TodayDelayStat {
  // ===== 航線即時 / 預測彙總 =====
  intl_Arrived: TrafficSummary;
  intl_Predict: TrafficSummary;

  cS_Arrived: TrafficSummary;
  cS_Predict: TrafficSummary;

  domestic_Arrived: TrafficSummary;
  domestic_Predict: TrafficSummary;

  // ===== 延誤航空公司 =====
  inDelayAirlines: DelayAirline[];
  outDelayAirlines: DelayAirline[];

  // ===== 延誤機場 =====
  inDelayAirport: DelayAirline[];
  outDelayAirport: DelayAirline[];

  // ===== 延誤航班 =====
  inDelayFlights: DelayFlight[];
  outDelayFlights: DelayFlight[];
  allDelayFlights: DelayFlight[];

  // ===== Top 3 機場 =====
  inTop3Airport: TopDelayAirport[];
  outTop3Airport: TopDelayAirport[];
  allTop3Airport: TopDelayAirport[];

  // ===== 延誤統計 =====
  delayStat: DelayStat;

  // ===== 小時統計 =====
  inBoundStatByHour: StatByHour[];
  outBoundStatByHour: StatByHour[];

  inBoundPredictByHour: StatByHour[];
  outBoundPredictByHour: StatByHour[];
}
