export interface IrregularFlightItem {
  flightNo: string;
  /** 目的地（離站、出境用） */
  arrivalPort: string;
  /** 出發地（到站、入境用） */
  departurePort: string;
  gate: string;
  sta: string;
  ata: string;
  delay: string;
  status: string;
  reason: string;
  handle: string;
}

// Wrapper matching the provided JSON shape
export interface IrregularInboundFlight {
  flightinfo: IrregularFlightItem[];
  actualFlight: number;
  actualPax: number;
  estFlight: number;
  estPax: number;
}
