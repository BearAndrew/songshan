import { TaxiInfo } from "../../../models/taxi.model";

export interface SearchTaxiData {
  searchRegPlate: string;
  taxiInfoList: TaxiInfo[];
}
