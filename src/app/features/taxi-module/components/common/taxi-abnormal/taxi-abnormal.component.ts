import { Component } from '@angular/core';
import { CommonService } from '../../../../../core/services/common.service';
import { ApiService } from '../../../../../core/services/api-service.service';
import { TaxiException } from '../../../../../models/taxi.model';
import { interval, startWith, Subject, take, takeUntil } from 'rxjs';
import { TaxiExceptionDialogComponent } from '../../create/components/taxi-exception-dialog/taxi-exception-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taxi-abnormal',
  imports: [CommonModule],
  templateUrl: './taxi-abnormal.component.html',
  styleUrl: './taxi-abnormal.component.scss',
})
export class TaxiAbnormalComponent {
  /** 未註冊車牌 */
  notReg: TaxiException[] = [];
  /** 黑名單 */
  blackList: TaxiException[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    interval(100000)
      .pipe(startWith(0), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadExceptionData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadExceptionData(): void {
    this.apiService
      .getTaxiException('NOTREG')
      .subscribe((res) => (this.notReg = res));

    this.apiService
      .getTaxiException('BLACKLIST')
      .subscribe((res) => (this.blackList = res));
  }

  openDialog(isNotReg: boolean) {
    const taxiList = isNotReg ? this.notReg : this.blackList;
    this.commonService
      .openCustomDialog(TaxiExceptionDialogComponent, {
        taxiList: taxiList,
        confirmText: '確定',
        cancelText: '',
      })
      .pipe(take(1))
      .subscribe();
  }
}
