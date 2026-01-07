export interface YearlyTrafficAnalysisRequest {
  year1: string;      // e.g. "2023"
  year2: string;      // e.g. "2024"
  year3: string;      // e.g. "2025"
  type: string;      // ALL / SCHEDULED / COMM / OTHER
  flightType: string;
  peer: string;
  airline: string;   // "CI", "BR", "ALL"...
  direction: string; // INBOUND / OUTBOUND
}

export interface YearlyTrafficStatItem {
  label: string;     // e.g. "Jan", "Feb"
  numOfFlight: number;
  numOfPax: number;
}

export interface YearlyTrafficYearData {
  stat: YearlyTrafficStatItem[];
  totalFlight: number;
  totalPax: number;
}

export interface YearlyTrafficAnalysisResponse {
  year: string;
  data: YearlyTrafficYearData;
}
