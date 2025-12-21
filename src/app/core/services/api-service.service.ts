import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airline } from '../../models/airline.model';
import { Airport } from '../../models/airport.model';
import { FlightTrafficAnalysisRequest } from '../../models/flight-traffic-analysis.model';
import { FlightTrafficPredictResponse } from '../../models/flight-traffic-predict.model';
import { IrregularFlightItem, IrregularInboundFlight } from '../../models/irregular-inbound-flight.model';
import { RealTimeTrafficFlowItem } from '../../models/real-time-traffic-flow.model';
import { StandbySummaryItem, StandbyListItem } from '../../models/standby.model';
import { TodayDelayStat } from '../../models/today-delay-stat.model';
import { TodayPredict } from '../../models/today-predict.model';
import { TodayStatus } from '../../models/today-status.model';
import { HttpHeaders } from '@angular/common/http';
import { FlightUpdateWebhookRequest } from '../../models/webhook-flight-update.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // ========= 基本資料 =========

  /** 取得機場清單 */
  getAirportList(): Observable<Airport[]> {
    return this.http.get<Airport[]>('GetAirportList');
  }

  /** 取得航空公司清單 */
  getAirlineList(): Observable<Airline[]> {
    return this.http.get<Airline[]>('GetAirlineList');
  }

  // ========= 今日狀態 / 預測 =========

  /** 全場今日狀態 */
  getTodayStatus(): Observable<TodayStatus> {
    return this.http.get<TodayStatus>('GetTodayStatus');
  }

  /** 指定機場今日狀態 */
  getTodayStatusByAirport(airport: string|null): Observable<TodayStatus> {
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
  getTodayDelayStat(): Observable<TodayDelayStat> {
    return this.http.get<TodayDelayStat>('GetTodayDelayStat');
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
  getIrregularInboundFlight(type: string | null): Observable<IrregularInboundFlight> {
    return this.http.get<IrregularInboundFlight>(`IrregularInboundFlight/${type}`);
  }

  /** 即時人流資訊 */
  getRealTimeTrafficFlow(): Observable<RealTimeTrafficFlowItem[]> {
    return this.http.get<RealTimeTrafficFlowItem[]>('RealTimeTrafficFlow');
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
  ): Observable<any> {
    return this.http.post<any>('FlightTrafficAnalysis', payload);
  }

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
    'Content-Type': 'application/json'
  });

  return this.http.post<any>(
    'webhook/flightUpdate',
    payload,
    { headers }
  );
}

}
