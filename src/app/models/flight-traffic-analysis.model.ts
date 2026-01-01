export type FlightTrafficType = 'ALL' | 'SCHEDULE' | 'COMM' | 'OTHER';
export type FlightDirection = 'INBOUND' | 'OUTBOUND';
export type FlightType = 'nondomestic' | 'intl' | 'crossstrait' | 'domestic' | 'all'

export interface FlightTrafficAnalysisRequest {
  dateFrom: string;    // e.g. "2025-12-10 10:00:00"
  dateTo: string;      // e.g. "2025-12-11 10:00:00"
  type: FlightTrafficType;  // e.g. ALL, SCHEDULE, COMM, OTHER
  airline: string;     // e.g. "CI"
  direction: FlightDirection; // "INBOUND" | "OUTBOUND"
  peer: string; // e.g. 3碼IATA code;
  flightType: FlightType; // e.g. "intl" ...
}


export interface FlightTrafficAnalysisResponse {
  statByHour: StatByHour[];
  totalFlight: number;
  totalPax: number;
}

export interface StatByHour {
  hour: string;       // 例如 "08:00"
  numOfFlight: number;
  numOfPax: number;
}
