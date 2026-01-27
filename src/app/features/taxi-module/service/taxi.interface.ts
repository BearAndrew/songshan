import { TaxiEventData, TaxiInfo, TaxiViolation } from '../../../models/taxi.model';

export interface SearchTaxiData {
  searchRegPlate: string;
  taxiInfoList: TaxiInfo[];
}

export interface SearchDailyTaxiData {
  eventData: TaxiEventData[];
  violationData: TaxiViolation[];
}
