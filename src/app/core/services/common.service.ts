import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  airportList: { label: string; value: number; code: string }[] = [];
  selectedAirport: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedFlightType: BehaviorSubject<string> = new BehaviorSubject<string>('');
  realAirportValue: number = -1;

  setAirportList(data: { label: string; value: number; code: string }[]) {
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

  setSelectedFlightType(flightType: string) {
    this.selectedFlightType.next(flightType);
  }

  getSelectedFlightType() {
    return this.selectedFlightType.asObservable();
  }

  getSelectedAirportValue() {
    return this.realAirportValue;
  }

  getAirportCodeById(airportId: number): string {
    const airport = this.airportList.find((a) => a.value === airportId);
    return airport ? airport.code : '';
  }

  observeScreenSize() {
    return fromEvent(window, 'resize').pipe(
      startWith(null),
      map(() => {
        const width = window.innerWidth;

        if (width < 640) {
          return 'sm';
        }

        if (width >= 1024) {
          return 'lg';
        }

        return 'md';
      })
    );
  }
}
