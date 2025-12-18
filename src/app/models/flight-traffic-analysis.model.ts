export type FlightTrafficType = 'ALL' | 'SCHEDULED' | 'COMM' | 'OTHER';
export type FlightDirection = 'INBOUND' | 'OUTBOUND';

export interface FlightTrafficAnalysisRequest {
  dateFrom: string;    // e.g. "2025-12-10 10:00:00"
  dateTo: string;      // e.g. "2025-12-11 10:00:00"
  type: FlightTrafficType;
  airline: string;     // e.g. "CI"
  direction: FlightDirection; // "INBOUND" | "OUTBOUND"
}
