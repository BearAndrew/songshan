import { TabType } from '../enums/tab-type.enum';

export interface DailyFlightAnalysisData {
  label: string;
  value: TabType;
  passengerData: { label: string; value: number; total: number }[];
  flightData: { label: string; value: number; total: number }[];
  delayData: {
    airline: DailyFlightAnalysisDelayData;
    airport: DailyFlightAnalysisDelayData;
  };
  abnormalData: DailyFlightAnalysisAbnormalData;
}

export interface DailyFlightAnalysisAbnormalData {
  info: {
    flightNumber: string;
    destination: string;
    scheduledTime: string;
    affectedPeople: number;
    status: string;
  }[];
  top3: {
    city: string;
    airport: string;
    forecast: {
      flightCount: number;
      passengerCount: number;
    };
    actual: {
      flightCount: number;
      passengerCount: number;
    };
  }[];
}

export interface DailyFlightAnalysisDelayData{
  out: {
    flightCode: string;
    flightCount: number;
    passengerCount: number;
    delayTime: number;
  }[];
  in: {
    flightCode: string;
    flightCount: number;
    passengerCount: number;
    delayTime: number;
  }[];
}
