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
  intl_Arrived: TrafficSummary;
  intl_Predict: TrafficSummary;

  inDelayAirlines: DelayAirline[];
  outDelayAirlines: DelayAirline[];

  inDelayFlights: DelayFlight[];
  outDelayFlights: DelayFlight[];

  inTop3Airport: TopDelayAirport[];
  outTop3Airport: TopDelayAirport[];

  delayStat: DelayStat;

  inBoundStatByHour: StatByHour[];
  outBoundStatByHour: StatByHour[];
}
