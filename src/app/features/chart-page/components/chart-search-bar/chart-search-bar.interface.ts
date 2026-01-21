import { TabType } from '../../../../core/enums/tab-type.enum';
import { FlightDirection } from '../../../../models/flight-traffic-analysis.model';

export interface ChartSearchBarForm {
  startYear: number | null;
  startMonth: number | null;
  startDay: number | null;
  endYear: number | null;
  endMonth: number | null;
  endDay: number | null;
  firstYear: number | null;
  secondYear: number | null;
  thirdYear: number | null;
  route: string | null;
  flightClass: string | null;
  airline: string;
  direction: FlightDirection;
  flightType: TabType;
}
