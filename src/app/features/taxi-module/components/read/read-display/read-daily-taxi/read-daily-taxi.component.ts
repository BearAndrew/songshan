import { Component } from '@angular/core';
import {
  TaxiEventData,
  TaxiViolation,
} from '../../../../../../models/taxi.model';
import { TaxiService } from '../../../../service/taxi.service';
import { MOCKDATA } from './fake-data';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-read-daily-taxi',
  imports: [CommonModule],
  templateUrl: './read-daily-taxi.component.html',
  styleUrl: './read-daily-taxi.component.scss',
})
export class ReadDailyTaxiComponent {
  dailyDataWithViolation: TaxiEventData[] = [];
  baseUrl = environment.apiBaseUrl + '/Taxi/CurrentTaxiPhotoById/';

  constructor(private taxiService: TaxiService) {
    this.taxiService.dailySubject$.subscribe((res) => {
      // res = MOCKDATA;
      const { eventData, violationData } = res;

      // 1️⃣ 建立 violation map（key = regPlate）
      const violationMap = new Map<string, TaxiViolation>();

      violationData.forEach((v) => {
        violationMap.set(v.regPlate, v);
      });

      // 2️⃣ 整理 eventData
      this.dailyDataWithViolation = eventData.map((event) => {
        const violation = violationMap.get(event.regPlate);

        return {
          ...event,
          violationType: violation ? violation.violationType : '',
        };
      });

      console.log(this.dailyDataWithViolation);
    });
  }
}
