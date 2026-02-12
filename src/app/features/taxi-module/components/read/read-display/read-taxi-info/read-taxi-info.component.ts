import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../../service/taxi.service';
import { TaxiEventData, TaxiInfo } from '../../../../../../models/taxi.model';
import { TaxiDuplicateComponent } from '../../../common/taxi-duplicate/taxi-duplicate.component';
import { ApiService } from '../../../../../../core/services/api-service.service';
import { forkJoin, map, Subject, take, takeUntil } from 'rxjs';
import { CommonService } from '../../../../../../core/services/common.service';

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
  regPlate: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private taxiService: TaxiService,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.taxiService.searchTaxi$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.hasSearch = true;
        this.taxiInfoList = res.taxiInfoList;

        this.regPlate = this.taxiInfoList?.[0]?.regPlate;
        if (this.regPlate) {
          const today = new Date().toISOString().slice(0, 10);
          this.loadExceptionData(this.regPlate, '2025-01-01', today);
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

  onEdit(): void {
    this.taxiService.clickEdit(this.taxiInfoList[0]);
  }

  onDelete() {
    // open confirm dialog and wait for user result via CommonService
    this.commonService
      .openDialog({
        message: `確認刪除車牌 ${this.regPlate} ?`,
        confirmText: '確定',
        cancelText: '取消',
      })
      .pipe(take(1))
      .subscribe((ok) => {
        if (!ok) return;

        this.apiService
          .deleteTaxi(this.regPlate)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const index = this.taxiInfoList.findIndex(
                (taxi) => taxi.regPlate === this.regPlate,
              );

              if (index !== -1) {
                this.taxiInfoList.splice(index, 1);
              }

              this.taxiService.afterDelete();
              // show success dialog
              this.commonService
                .openDialog({
                  message: '刪除成功',
                  confirmText: '確定',
                  cancelText: '',
                })
                .pipe(take(1))
                .subscribe();
            },
            error: (err) => {
              const msg = err?.error?.message || err?.message || '請再次嘗試';
              this.commonService
                .openDialog({
                  title: '刪除失敗',
                  message: `錯誤訊息：${msg}`,
                  confirmText: '確定',
                  cancelText: '',
                })
                .pipe(take(1))
                .subscribe();
            },
          });
      });
  }
}
