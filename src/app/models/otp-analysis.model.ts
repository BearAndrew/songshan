export interface OtpAnalysisRequest {
  dateFrom: string;   // e.g. "2025-12-10 10:00:00" or "2025-12-10"
  dateTo: string;     // e.g. "2025-12-11 10:00:00" or "2025-12-11"
  type: string;       // ALL / SCHEDULED / COMM / OTHER
  flightType: string;
  peer: string;
  airline: string;    // e.g. "CI"
  direction: string;  // INBOUND / OUTBOUND
}

export interface OtpStatItem {
  label: string;
  numOfFlight: number;
  OnTimeFlight: number;
  OnTimeRate: number; // 0~1 or 0~100 (依後端定義)
}

export interface OtpQueryData {
  stat: OtpStatItem[];
  totalFlight: number;
  OnTimeRate: number; // overall rate
}

export interface OtpAnalysisResponse {
  queryData: OtpQueryData;
}
