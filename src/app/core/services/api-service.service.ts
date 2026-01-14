import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Airline } from '../../models/airline.model';
import { Airport } from '../../models/airport.model';
import {
  FlightTrafficAnalysisRequest,
  FlightTrafficAnalysisResponse,
} from '../../models/flight-traffic-analysis.model';
import { FlightTrafficPredictResponse } from '../../models/flight-traffic-predict.model';
import { IrregularInboundFlight } from '../../models/irregular-inbound-flight.model';
import { RealTimeTrafficFlowItem } from '../../models/real-time-traffic-flow.model';
import {
  StandbySummaryItem,
  StandbyListItem,
} from '../../models/standby.model';
import { TodayDelayStat } from '../../models/today-delay-stat.model';
import { TodayPredict } from '../../models/today-predict.model';
import { TodayStatus } from '../../models/today-status.model';
import { HttpHeaders } from '@angular/common/http';
import { FlightUpdateWebhookRequest } from '../../models/webhook-flight-update.model';
import { BaggageTimeItem } from '../../models/baggage-time.model';
import {
  TaxiInfo,
  TaxiViolation,
  TaxiStat,
  TaxiStatusInfo,
} from '../../models/taxi.model';
import { TabType } from '../enums/tab-type.enum';
import { FlightStatus } from '../../models/flight-status.model';
import {
  OtpAnalysisRequest,
  OtpAnalysisResponse,
} from '../../models/otp-analysis.model';
import {
  YearlyTrafficAnalysisRequest,
  YearlyTrafficAnalysisResponse,
} from '../../models/yearly-traffic-analysis.model';
import {
  IrregularAnalysisRequest,
  IrregularAnalysisResponse,
} from '../../models/irregular-analysis.model';
import {
  HistoricStandbySummaryItem,
  HistoricStandbySummaryRequest,
} from '../../models/historic-standby-summary.model';
import {
  HistoricStandbyListRequest,
  HistoricStandbyListItem,
} from '../../models/historic-standby-list.model';
import {
  CounterAdminApprovalRequest,
  CounterApplicationManualRequest,
  CounterApplyEditRequest,
  CounterGetAllRequest,
  CounterInfo,
  CounterInfoRaw,
  CounterSeason,
} from '../../models/counter.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // ========= 基本資料 =========

  /** 取得機場清單 */
  getAirportList(): Observable<Airport[]> {
    return this.http.get<Airport[]>('GetAirportList');
  }

  /** 取得台灣機場清單 */
  GetAirportListTaiwan(): Observable<Airport[]> {
    return this.http.get<Airport[]>('GetAirportListTaiwan');
  }

  /** 取得航空公司清單 */
  getAirlineList(): Observable<Airline[]> {
    return this.http.get<Airline[]>('GetAirlineList');
  }

  /** 取得飛航異常狀態清單 */
  getFlightStatus(): Observable<FlightStatus[]> {
    return this.http.get<FlightStatus[]>('GetFlightStatus');
  }

  // ========= 今日狀態 / 預測 =========

  /** 全場今日狀態 */
  getTodayStatus(): Observable<TodayStatus> {
    return this.http.get<TodayStatus>('GetTodayStatus');
  }

  /** 指定機場今日狀態 */
  getTodayStatusByAirport(airport: string | null): Observable<TodayStatus> {
    return this.http.get<TodayStatus>(`GetTodayStatusByAirport/${airport}`);
  }

  /** 全場今日預測 */
  getTodayPredict(): Observable<TodayPredict> {
    return this.http.get<TodayPredict>('GetTodayPredict');
  }

  /** 指定機場今日預測 */
  getTodayPredictByAirport(airport: string | null): Observable<TodayPredict> {
    return this.http.get<TodayPredict>(`GetTodayPredictByAirport/${airport}`);
  }

  // ========= 延誤統計 =========

  /** 今日延誤統計 */
  getTodayDelayStat(type: TabType): Observable<TodayDelayStat> {
    return this.http.get<TodayDelayStat>(`GetTodayDelayStat/${type}`);
  }

  // ========= 候補旅客 =========

  /** 指定機場候補總覽 */
  getStandbySummary(airport: string | null): Observable<StandbySummaryItem[]> {
    return this.http.get<StandbySummaryItem[]>(`GetStandbySummary/${airport}`);
  }

  /** 指定機場候補名單 */
  getStandbyList(airport: string | null): Observable<StandbyListItem[]> {
    return this.http.get<StandbyListItem[]>(`GetStandbyList/${airport}`);
  }

  // ========= 不正常/即時狀況 =========

  /**
   * 不正常入境航班
   * @param type 依 API 定義的分類 (例如: "ALL", "DIVERT", "CANCEL"… 若後端有定義)
   */
  getIrregularInboundFlight(
    type: string,
    direction: string,
    delayCode: string | null
  ): Observable<IrregularInboundFlight> {
    const url =
      `IrregularInboundFlight/${type}/${direction}` +
      (delayCode ? `/${delayCode}` : '');
    return this.http.get<IrregularInboundFlight>(url);
  }

  /** 即時人流資訊 */
  getRealTimeTrafficFlow(type: string): Observable<RealTimeTrafficFlowItem[]> {
    return this.http.get<RealTimeTrafficFlowItem[]>(
      `RealTimeTrafficFlow/${type}`
    );
  }

  /** 即時人流（行李） */
  getBaggageTime(): Observable<BaggageTimeItem[]> {
    return this.http.get<BaggageTimeItem[]>('BaggageTime');
  }

  // ========= 未來流量預測 =========

  /**
   * 航班流量預測
   * @param airport 機場 IATA (例: "TPE")
   * @param day     由 API 定義的日期代碼 (例: "TOMORROW", "TWODAY"... 依實際後端)
   * @param type    由 API 定義的類型
   */
  getFlightTrafficPredict(
    airport: string,
    day: string,
    type: string
  ): Observable<FlightTrafficPredictResponse> {
    return this.http.get<FlightTrafficPredictResponse>(
      `FlightTrafficPredict/${airport}/${day}/${type}`
    );
  }

  /**
   * 航班流量分析 (POST)
   * 回傳結構尚未定義，暫時使用 any
   */
  postFlightTrafficAnalysis(
    payload: FlightTrafficAnalysisRequest
  ): Observable<FlightTrafficAnalysisResponse> {
    return this.http.post<FlightTrafficAnalysisResponse>(
      'FlightTrafficAnalysis',
      payload
    );
  }

  /**POST
   * 定航運量分析. 與9不一樣是能選航點
   */
  postFlightTrafficAnalysisSch(
    payload: FlightTrafficAnalysisRequest
  ): Observable<FlightTrafficAnalysisResponse> {
    return this.http.post<FlightTrafficAnalysisResponse>(
      'FlightTrafficAnalysisSch',
      payload
    );
  }

  /**
   * 年度運量對比分析
   * POST {apiBaseUrl}/YearlyTrafficAnalysis
   */
  postYearlyTrafficAnalysis(
    payload: YearlyTrafficAnalysisRequest
  ): Observable<YearlyTrafficAnalysisResponse[]> {
    return this.http.post<YearlyTrafficAnalysisResponse[]>(
      'YearlyTrafficAnalysis',
      payload
    );
  }

  /**
   * POST api/YearlyTrafficAnalysisSch
   *定航運量對比資料
   */
  postYearlyTrafficAnalysisSch(
    payload: YearlyTrafficAnalysisRequest
  ): Observable<YearlyTrafficAnalysisResponse[]> {
    return this.http.post<YearlyTrafficAnalysisResponse[]>(
      'YearlyTrafficAnalysisSch',
      payload
    );
  }

  /**
   * 準點率分析 (OTP)
   * POST {apiBaseUrl}/OTPAnalysis
   */
  postOtpAnalysis(
    payload: OtpAnalysisRequest
  ): Observable<OtpAnalysisResponse> {
    return this.http.post<OtpAnalysisResponse>('OTPAnalysis', payload);
  }

  /**
   * 航班異常分析
   * POST {apiBaseUrl}/IrregularAnalysis
   */
  postIrregularAnalysis(
    payload: IrregularAnalysisRequest
  ): Observable<IrregularAnalysisResponse> {
    return this.http.post<IrregularAnalysisResponse>(
      'IrregularAnalysis',
      payload
    );
  }

  /**
   * 歷史候補總覽（國內航線候補分析 - 第一畫面）
   * POST {apiBaseUrl}/GetHistoricStandbySummary
   */
  postHistoricStandbySummary(
    payload: HistoricStandbySummaryRequest
  ): Observable<HistoricStandbySummaryItem[]> {
    return this.http.post<HistoricStandbySummaryItem[]>(
      'GetHistoricStandbySummary',
      payload
    );
  }

  /**
   * 歷史候補明細（第二畫面）
   * POST {apiBaseUrl}/GetStandbyHistoricList/{Airport}
   */
  postHistoricStandbyList(
    airport: string,
    payload: HistoricStandbyListRequest
  ): Observable<HistoricStandbyListItem[]> {
    return this.http.post<HistoricStandbyListItem[]>(
      `GetStandbyHistoricList/${airport}`,
      payload
    );
  }

  // ========= Webhook =========

  /**
   * Webhook - Flight Update
   *
   * @param payload webhook request body
   * @param signature X-signature header value
   */
  postWebhookFlightUpdate(
    payload: FlightUpdateWebhookRequest,
    signature: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'X-signature': signature,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>('webhook/flightUpdate', payload, { headers });
  }

  // ========= Taxi =========

  /** 取得計程車全部列表 */
  getTaxiList(): Observable<TaxiInfo[]> {
    return this.http.get<TaxiInfo[]>('Taxi');
  }

  /** 建立新計程車記錄 */
  postTaxi(payload: TaxiInfo): Observable<Object> {
    return this.http.post<Object>('Taxi', payload);
  }

  /** 計程車列表搜索 */
  searchTaxi(keyword: string): Observable<TaxiInfo[]> {
    return this.http.get<TaxiInfo[]>(`Taxi/search/${keyword}`);
  }

  /** 更新計程車記錄 */
  // updateTaxi(plate: string, payload: TaxiInfo): Observable<TaxiInfo> {
  //   return this.http.put<TaxiInfo>(`Taxi/${plate}`, payload);
  // }

  /** 刪除計程車記錄 */
  deleteTaxi(plate: string): Observable<void> {
    return this.http.delete<void>(`Taxi/${plate}`);
  }

  /** 匯入計程車資料 (multipart/form-data) */
  importTaxi(formData: FormData): Observable<any> {
    return this.http.post<any>('Taxi/import', formData);
  }

  /** 計程車黑/灰名單全部列表
   * violationType = BLACKLIST | GREYLIST
   */
  getTaxiViolationAll(violationType: string): Observable<TaxiViolation[]> {
    return this.http.get<TaxiViolation[]>(`TaxiViolationAll/${violationType}`);
  }

  /** 取得單筆黑/灰名單記錄 */
  getTaxiViolation(rid: number): Observable<TaxiViolation> {
    return this.http.get<TaxiViolation>(`TaxiViolation/${rid}`);
  }

  /** 更新黑/灰名單記錄 */
  updateTaxiViolation(
    rid: number,
    payload: TaxiViolation
  ): Observable<TaxiViolation> {
    return this.http.put<TaxiViolation>(`TaxiViolation/${rid}`, payload);
  }

  /** 刪除黑/灰名單記錄 */
  deleteTaxiViolation(rid: number): Observable<void> {
    return this.http.delete<void>(`TaxiViolation/${rid}`);
  }

  /** 某一台計程車黑/灰名單記錄 */
  // getTaxiViolationByPlate(plate: string): Observable<TaxiViolation[]> {
  //   return this.http.get<TaxiViolation[]>(`TaxiViolation/filter/${plate}`);
  // }

  /** 新增黑/灰名單記錄 */
  postTaxiViolation(payload: TaxiViolation): Observable<TaxiViolation> {
    return this.http.post<TaxiViolation>('TaxiViolation', payload);
  }

  /** 即時車流統計 */
  getTaxiStat(): Observable<TaxiStat> {
    return this.http.get<TaxiStat>('/Taxi/Stat');
  }

  /** 最常出現6台車 */
  getTop6Taxi(
    sortBy: string,
    dateFrom: string,
    dateTo: string
  ): Observable<TaxiStatusInfo[]> {
    return this.http.get<TaxiStatusInfo[]>(
      `Taxi/Top6Taxi/${sortBy}/${dateFrom}/${dateTo}`
    );
  }

  /** 現時在場的車 */
  // getCurrentTaxi(): Observable<TaxiStatusInfo[]> {
  //   return this.http.get<TaxiStatusInfo[]>('Taxi/CurrentTaxi');
  // }

  // ========= 報到櫃台 =========
  /** 報到櫃台 - 取得全部 */
  getAllCounter(payload: CounterGetAllRequest): Observable<CounterInfo[]> {
    return this.http
      .get<CounterInfoRaw[]>(
        `Counter/GetAll/${payload.status}/${payload.agent}/${payload.dateFrom}/${payload.dateTo}`
      )
      .pipe(
        map((res) =>
          res.map((item) => ({
            requestId: item.request_id,
            agent: item.agent,
            airlineIata: item.airline_iata,
            flightNo: item.flight_no,
            season: item.season,
            applyForPeriod: item.apply_for_period,
            applicationDate: item.application_date,
            dayOfWeek: item.day_of_week,
            startTime: item.start_time,
            endTime: item.end_time,
            status: item.status,
            assignedBy: item.assigned_by,
            appliedBy: item.applied_by,
            assignedCounterArea: item.assigned_counter_area,
          }))
        )
      );
  }

  /** 新增手動申請 */
  addCounterApplication(
    payload: CounterApplicationManualRequest
  ): Observable<void> {
    return this.http.post<void>('/Counter/ApplicationManual', payload);
  }

  /** 修改手動申請/核准前後資料 */
  applyEdit(payload: CounterApplyEditRequest): Observable<void> {
    return this.http.post<void>('/Counter/ApplyEdit', payload);
  }

  /** 櫃檯申請－管理者核準 */
  adminApproval(payload: CounterAdminApprovalRequest): Observable<void> {
    return this.http.post<void>('/Counter/AdminApproval', payload);
  }

  /** 取得各季時間 */
  getSeasons(): Observable<CounterSeason[]> {
    return this.http.get<CounterSeason[]>('/Counter/GetSeasons');
  }
}
