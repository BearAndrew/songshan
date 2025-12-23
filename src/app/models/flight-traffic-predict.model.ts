export interface PredictFlightItem {
  flightNo: string;
  airlineName: string;
  airportName: string;
  schTime: string;
  noOfPax: number;
}

export interface PredictStatByHour {
  hour: string;
  numOfFlight: number;
  numOfPax: number;
}

export interface FlightTrafficPredictResponse {
  inboundFlight: PredictFlightItem[];
  outboundFlight: PredictFlightItem[];

  tomorrowStatByHour: PredictStatByHour[];
  twoDayStatByHour: PredictStatByHour[];

  tomorrowFlight: number;
  twoDayFlight: number;
  tomorrowPax: number;
  twoDayPax: number;
}
