export const statusMap: Record<string, string> = {
  APPLY: '核准中',
  APPROVE: '已核准',
  REJECT: '駁回'
};


export interface CounterGetAllRequest {
  status: string;
  agent: string;
  dateFrom: string; // yyyy/MM/dd
  dateTo: string;   // yyyy/MM/dd
}

export interface CounterInfo {
  /** 申請單 ID */
  requestId: string;

  /** 代理商 */
  agent: string;

  /** 航空公司 IATA */
  airlineIata: string;

  /** 航班號碼 */
  flightNo: string;

  /** 季節 */
  season: string;

  /** 申請期間 */
  applyForPeriod: string;

  /** 申請日期 */
  applicationDate: string;

  /** 星期（1~7） */
  dayOfWeek: string;

  /** 開始時間 */
  startTime: string;

  /** 結束時間 */
  endTime: string;

  /** 狀態 */
  status: string;

  /** 指派人員 */
  assignedBy: string;

  /** 申請人（可能為 null） */
  appliedBy: string | null;

  /** 指派櫃台區域 */
  assignedCounterArea: string;
}

export interface CounterInfoRaw {
  request_id: string;
  agent: string;
  airline_iata: string;
  flight_no: string;
  season: string;
  apply_for_period: string;
  application_date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  status: string;
  assigned_by: string;
  applied_by: string | null;
  assigned_counter_area: string;
}



export interface CounterApplicationManualRequest {
  agent: string;
  airline_iata: string;
  flight_no: string;
  season: string;
  day_of_week: string;
  apply_for_period: string;
  startDate: string; // ISO 字串
  endDate: string;   // ISO 字串
  start_time: string;
  end_time: string;
}


export interface CounterApplyEditRequest {
  requestId: string;
  airlineIata: string;
  flightNo: string;
  season: string;
  apply_for_period: string;
  startDate: string;  // ISO 字串
  endDate: string;    // ISO 字串
  dayOfWeek: string;  // ex: "1,2,3"
  startTime: string;  // ex: "10:00:00"
  endTime: string;    // ex: "12:30:00"
}
