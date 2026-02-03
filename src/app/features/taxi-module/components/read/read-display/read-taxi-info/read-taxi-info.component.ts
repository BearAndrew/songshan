import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../../service/taxi.service';
import { TaxiException, TaxiInfo } from '../../../../../../models/taxi.model';
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
  exceptionDetail: TaxiException | null = null;

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
          this.loadExceptionData(regPlate);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadExceptionData(regPlate: string): void {
    forkJoin({
      notReg: this.apiService.getTaxiException('NOTREG'),
      blackList: this.apiService.getTaxiException('BLACKLIST'),
    })
      .pipe(
        map(({ notReg, blackList }) => {
          const merged = [...notReg, ...blackList];

          // 找出符合車牌的那一筆
          return merged.find((item) => item.regPlate === regPlate) || null;
        }),
      )
      .subscribe((result) => {
        this.exceptionDetail = result;
      });
  }
}
