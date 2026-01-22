import { Component, Input } from '@angular/core';
import { TaxiInfo } from '../../../../../models/taxi.model';
import { ApiService } from '../../../../../core/services/api-service.service';
import { TaxiService } from '../../../service/taxi.service';
import { CommonService } from '../../../../../core/services/common.service';
import { Subject, takeUntil, take } from 'rxjs';

@Component({
  selector: 'app-taxi-duplicate',
  imports: [],
  templateUrl: './taxi-duplicate.component.html',
  styleUrl: './taxi-duplicate.component.scss',
})
export class TaxiDuplicateComponent {
  @Input() taxiInfoList: TaxiInfo[] = [];
  private destroy$ = new Subject<void>();

  constructor(
  private apiService: ApiService,
  private taxiService: TaxiService,
  private commonService: CommonService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEdit(taxiInfo: TaxiInfo): void {
    this.taxiService.clickEdit(taxiInfo);
  }

  onDelete(plate: string) {
    // open confirm dialog and wait for user result via CommonService
    this.commonService
      .openDialog({ message: `確認刪除車牌 ${plate} ?`, confirmText: '確定', cancelText: '取消' })
      .pipe(take(1))
      .subscribe((ok) => {
        if (!ok) return;

        this.apiService
          .deleteTaxi(plate)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const index = this.taxiInfoList.findIndex(
                (taxi) => taxi.regPlate === plate,
              );

              if (index !== -1) {
                this.taxiInfoList.splice(index, 1);
              }

              this.taxiService.afterDelete();
              // show success dialog
              this.commonService.openDialog({ message: '刪除成功', confirmText: '確定', cancelText: '' }).pipe(take(1)).subscribe();
            },
            error: (err) => {
              const msg = err?.error?.message || err?.message || '請再次嘗試';
              this.commonService.openDialog({ title: '刪除失敗', message: `錯誤訊息：${msg}`, confirmText: '確定', cancelText: '' }).pipe(take(1)).subscribe();
            },
          });
      });
  }
}
