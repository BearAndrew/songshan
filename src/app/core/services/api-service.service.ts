import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
