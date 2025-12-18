export interface CheckInCounter {
  counterNumber: string;
  openTime: string;
  closeTime: string;
}

export interface FlightUpdateFlight {
  flightDate: string;
  iata: string;
  icao: string;
  flightNumber: string;
  codeShareMaster: number;
  codeShare: string;
  airFlyLine: string;
  airFlyIO: string;
  boardingGate: string;
  aircraftType: string;
  airPlaneCode: string;
  apron: string;
  checkInCounter: CheckInCounter[];
  flightType: string;
  flightStatus: number;
  flightStatusProcessed: number;

  BHSNo: string;
  BHSStatus: string;
  BHSStatusEN: string;

  departureAirportIata: string;
  arrivalAirportIata: string;
  diversionAirportIata: string;

  delayTime: number;
  delayReason: string;

  gateCloseTime: string;

  std: string;
  etd: string;
  atd: string;

  eet: number;

  sta: string;
  eta: string;
  ata: string;
}

export interface FlightUpdateChange {
  type: string;
  flight: FlightUpdateFlight;
}

export interface FlightUpdateWebhookRequest {
  version: string;
  generatedAt: string;
  changes: FlightUpdateChange[];
}
