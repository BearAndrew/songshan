import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../../service/taxi.service';
import { TaxiEventData, TaxiInfo } from '../../../../../../models/taxi.model';
import { TaxiDuplicateComponent } from '../../../common/taxi-duplicate/taxi-duplicate.component';
import { ApiService } from '../../../../../../core/services/api-service.service';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-read-taxi-info',
  imports: [CommonModule, TaxiDuplicateComponent],
  templateUrl: './read-taxi-info.component.html',
  styleUrl: './read-taxi-info.component.scss',
})
export class ReadTaxiInfoComponent {
  hasSearch: boolean = false;
  taxiInfoList!: TaxiInfo[];
  exceptionDetail: TaxiEventData | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private taxiService: TaxiService,
    private apiService: ApiService,
  ) {
    this.taxiService.searchTaxi$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.hasSearch = true;
        this.taxiInfoList = res.taxiInfoList;

        const regPlate = this.taxiInfoList?.[0]?.regPlate;
        if (regPlate) {
          const today = new Date().toISOString().slice(0, 10);
          this.loadExceptionData(regPlate, '2025-01-01', today);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadExceptionData(
    regPlate: string,
    dateFrom: string,
    dateTo: string,
  ): void {
    this.apiService
      .getTaxiEventData(regPlate, dateFrom, dateTo)
      .subscribe((res) => {
        // 沒資料就設為 null，避免畫面壞掉
        this.exceptionDetail = res?.length ? res[0] : null;
      });
  }
}
