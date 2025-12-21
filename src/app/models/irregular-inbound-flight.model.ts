export interface IrregularFlightItem {
  flightNo: string;
  departurePort: string;
  gate: string;
  sta: string;
  ata: string;
  delay: string;
  reason: string;
  estHandle: string;
  actualHandle: string;
}

// Wrapper matching the provided JSON shape
export interface IrregularInboundFlight {
  flightinfo: IrregularFlightItem[];
  actualFlight: number;
  actualPax: number;
  estFlight: number;
  estPax: number;
}
