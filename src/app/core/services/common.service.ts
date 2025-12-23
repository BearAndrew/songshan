import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) {}

  airportList: {'label':string, 'value':number, code:string}[] = [];
  selectedAirport: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  realAirportValue: number = -1;

  setAirportList(data: {'label':string, 'value':number, code:string}[]) {
    this.airportList = data;
  }

  getAirportList() {
    return this.airportList;
  }

  setSelectedAirport(airportId: number) {
    this.selectedAirport.next(airportId);
    this.realAirportValue = airportId;
  }

  getSelectedAirport() {
    return this.selectedAirport.asObservable();
  }

  getSelectedAirportValue() {
    return this.realAirportValue;
  }

  getAirportCodeById(airportId: number): string | null {
    const airport = this.airportList.find(a => a.value === airportId);
    return airport ? airport.code : null;
  }
}
