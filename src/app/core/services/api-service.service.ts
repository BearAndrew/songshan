import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airport } from '../../models/airport.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * 取得機場清單
   * 實際請求 URL 會經由 interceptor 變成：
   *   http://jasonpolaristw.ddns.net:9025/api/GetAirportList
   */
  getAirportList(): Observable<Airport[]> {
    return this.http.get<Airport[]>('GetAirportList');
    // 如果你比較喜歡帶 /api/，也可以：
    // return this.http.get<Airport[]>('/GetAirportList');
  }

  // 未來如果有其他 API，可以繼續在這裡加：
  // getSomething(id: string) {
  //   return this.http.get<SomeType>(`SomeEndpoint/${id}`);
  // }
}
