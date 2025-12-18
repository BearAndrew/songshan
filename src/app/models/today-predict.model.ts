import { TrafficSummary } from './traffic-summary.model';

/** 只有 GetTodayPredict 用的簡單日期字串 */
export interface TodayPredict {
  date: string; // e.g. "2025-12-18"
  intl_Arrived: TrafficSummary;
  intl_Predict: TrafficSummary;
  crossStrait_Arrived: TrafficSummary;
  crossStrait_Predict: TrafficSummary;
  domestic_Arrived: TrafficSummary;
  domestic_Predict: TrafficSummary;
  intl_Predict60: TrafficSummary;
  crossStrait_Predict60: TrafficSummary;
  domestic_Predict30: TrafficSummary;
  intl_Predict120: TrafficSummary;
  crossStrait_Predict120: TrafficSummary;
  domestic_Predict60: TrafficSummary;
  totalFlight_Arrived: number;
  totalPax_Arrived: number;
  totalFlight_Predict: number;
  totalPax_Predict: number;
}

/** GetTodayPredictByAirport 的 date 結構 */
export interface TodayPredictDate {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  dayOfYear: number;
  dayNumber: number;
}

/** GetTodayPredictByAirport/{Airport} 回應 */
export interface TodayPredictByAirport {
  date: TodayPredictDate;
  intl_Arrived: TrafficSummary;
  intl_Predict: TrafficSummary;
  crossStrait_Arrived: TrafficSummary;
  crossStrait_Predict: TrafficSummary;
  domestic_Arrived: TrafficSummary;
  domestic_Predict: TrafficSummary;
  intl_Predict60: TrafficSummary;
  crossStrait_Predict60: TrafficSummary;
  domestic_Predict30: TrafficSummary;
  intl_Predict120: TrafficSummary;
  crossStrait_Predict120: TrafficSummary;
  domestic_Predict60: TrafficSummary;
  totalFlight_Arrived: number;
  totalPax_Arrived: number;
  totalFlight_Predict: number;
  totalPax_Predict: number;
}
