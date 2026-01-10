import { TaxiInfo } from "../../../models/taxi.model";
import { Option } from "../../../shared/components/dropdown-secondary/dropdown-secondary.component";

export interface SearchTaxiData {
  searchRegPlate: string;
  taxiInfoList: SearchTaxiInfo[];
}

export interface SearchTaxiInfo extends TaxiInfo {
  /** 修改內容 */
  modifyContent?: Option;
  /** 停權時間 */
  suspensionPeriod?: string;
}
