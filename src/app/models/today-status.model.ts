import { TrafficSummary } from './traffic-summary.model';

export interface TodayStatus {
  date: string; // "2025-12-18"

  intl: TrafficSummary;
  crossStrait: TrafficSummary;
  domestic: TrafficSummary;

  totalFlight_Total: number;
  totalPax_Total: number;
}

// 如果你想分開命名，也可以這樣：
// export type TodayStatusByAirport = TodayStatus;
