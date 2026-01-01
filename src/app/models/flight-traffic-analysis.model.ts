import { TabType } from "../core/enums/tab-type.enum";

export type FlightTrafficType = 'ALL' | 'SCHEDULE' | 'COMM' | 'OTHER';
export type FlightDirection = 'INBOUND' | 'OUTBOUND';

export interface FlightTrafficAnalysisRequest {
  dateFrom: string;    // e.g. "2025-12-10 10:00:00"
  dateTo: string;      // e.g. "2025-12-11 10:00:00"
  type: FlightTrafficType;  // e.g. ALL, SCHEDULE, COMM, OTHER
  airline: string;     // e.g. "CI"
  direction: FlightDirection; // "INBOUND" | "OUTBOUND"
  peer: string; // e.g. 3碼IATA code;
  flightType: TabType; // e.g. "intl" ...
}


export interface FlightTrafficAnalysisResponse {
  queryData: FlightTrafficData;
  compareData: FlightTrafficData;
}

export interface FlightTrafficData {
  stat: StatItem[];
  totalFlight: number;
  totalPax: number;
}

export interface StatItem {
  label: string;      // 例如 "0600"
  numOfFlight: number;
  numOfPax: number;
}
