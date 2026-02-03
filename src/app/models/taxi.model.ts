// Models for Taxi APIs
// NOTE: The original API schema details were not fully provided. I inferred reasonable fields
// from the API descriptions in taxi.json. Adjust field names/types if your backend differs.
export interface TaxiInfo {
  regPlate: string;     // 車牌號碼
  driverNo: string;     // 駕駛證號
  driverName: string;   // 駕駛姓名
  driverPhone: string;  // 聯絡電話
  remark: string;       // 備註
  status: string | null;       // 狀態 // e.g. 'BLACKLIST' | 'GREYLIST' | ''
  [key: string]: any;
}


export interface TaxiViolation {
  /** 紀錄 ID */
  rid: number;

  /** 車牌號碼 */
  regPlate: string;

  /** 停權開始時間 */
  dateFrom: string; // ISO string: 2026-01-01T00:00:00

  /** 停權結束時間 */
  dateTo: string; // ISO string: 2026-01-01T00:00:00

  /** 違規類型 */
  violationType: string;  // 'BLACKLIST' | 'GREYLIST' | ''

  /** 停權 / 違規原因 */
  reason: string;

  /** 司機編號 */
  driver_no: string;

  /** 司機姓名 */
  driver_name: string;
}

export interface TaxiStat {
  total?: number;
  inPark?: number;
  active?: number;
  updatedAt?: string;
  // allow extra info from backend
  [key: string]: any;
}

export interface TaxiStatusInfo {
  /** 車牌號碼 */
  regPlate: string;

  /** 司機姓名 */
  driverName: string;

  /** 違規類型 */
  violationType: string;

  /** 次數 */
  count: number;
}


export interface TaxiStat {
  taxiWaiting: number;

  currentPeopleCount_Intl: number;
  currentPeopleCount_Domestic: number;

  estWaitingTime_Intl: number;
  estWaitingTime_Domestic: number;

  served_Intl: number;
  served_Domestic: number;

  avgTaxiPerHour: number;
  avgWaitTaxi: number;
  avgWaitPax: number;
}


export interface TaxiEventData {
  regPlate: string;
  driverName: string;
  inTime: string;   // ISO string
  outTime: string;
  image: string;
  [key: string]: any;
}


export interface CurrentTaxi {
  regPlate: string;      // 車牌
  driverName: string;    // 司機姓名
  violation: string;     // 違規狀態（黑名單 / 灰名單 / 空字串）
  inTime: string;        // 進場時間（ISO string）
  location: string;     // 區域
  image: string;        // 圖片 URL / base64
}


export interface TaxiExceptionTime {
  intime: string;    // ISO datetime
  outtime: string;   // ISO datetime
}

export interface TaxiException {
  regPlate: string;
  recCount: number;
  timeLists: TaxiExceptionTime[];
}
