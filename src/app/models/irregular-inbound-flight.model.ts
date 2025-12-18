export interface IrregularFlightItem {
  flightNo: string;
  arrivalTime: string;
  departurePort: string;
  gate: string;
  reason: string;
  status: string;
}

export interface IrregularInboundFlightResponse {
  actual: IrregularFlightItem[];
  estimate: IrregularFlightItem[];
}
