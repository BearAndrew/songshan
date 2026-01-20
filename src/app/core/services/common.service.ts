import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, map, startWith } from 'rxjs';
import { Option } from '../../shared/components/dropdown/dropdown.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  private airportList: Option[] = [];
  private selectedAirport$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setAirportList(data: Option[]) {
    this.airportList = data;
  }

  getAirportList() {
    return this.airportList;
  }

  setSelectedAirport(airportCode: string) {
    this.selectedAirport$.next(airportCode);
  }

  getSelectedAirport() {
    return this.selectedAirport$.asObservable();
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
