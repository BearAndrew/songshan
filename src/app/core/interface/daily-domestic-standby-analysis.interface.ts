export interface DetailRow {
  airline: string;
  waitlist: number;
  onsite: number;
  nextFlights: number;
  flown: number;
  filled: number;
}

export interface WeatherInfo {
  temperature: string;
  description: string;
  visibility: string;
  altitude: string;
  windSpeed: string;
}

export interface FlightRow {
  route: string;
  weather: WeatherInfo;
  details: DetailRow[]; // 3 筆 row
  maxWaitlist?: number;
  maxNextFlights?: number;
  maxFlown?: number;
  maxFilled?: number;
  routerParam: string;
}
