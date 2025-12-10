export interface DailyFlightAnalysisData {
  label: string;
  passengerData: { label: string; value: number; total: number }[];
  flightData: { label: string; value: number; total: number }[];
  delayData: {
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
  };
  abnormalData: {
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
      }
    }[];
  };
}
