// Models for Taxi APIs
// NOTE: The original API schema details were not fully provided. I inferred reasonable fields
// from the API descriptions in taxi.json. Adjust field names/types if your backend differs.

export interface TaxiInfo {
  plate: string; // 車牌號碼
  driverId?: string; // 駕駛証碼
  driverName?: string;
  driverPhone?: string;
  note?: string;
  status?: string; // e.g. 'BLACKLIST' | 'GREYLIST' | ''
}

export interface TaxiViolation {
  rid: number;
  plate: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  violationType?: 'BLACKLIST' | 'GREYLIST' | string;
  note?: string;
  // extra fields that backend may return
  createdBy?: string;
  createdAt?: string;
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
  plate: string;
  count?: number; // 出現次數或相關排序依據
  lastSeen?: string; // 時間戳記或日期字串
  status?: string; // 當前狀態
  // any other fields returned by API
  [key: string]: any;
}
