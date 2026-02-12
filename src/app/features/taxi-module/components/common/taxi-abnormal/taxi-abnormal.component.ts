import { Component } from '@angular/core';
import { CommonService } from '../../../../../core/services/common.service';
import { ApiService } from '../../../../../core/services/api-service.service';
import { TaxiException } from '../../../../../models/taxi.model';
import {
  catchError,
  EMPTY,
  forkJoin,
  interval,
  Observable,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
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
  /** 停權名單 */
  blackList: TaxiException[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    interval(10000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$),
        switchMap(() =>
          this.loadExceptionData().pipe(
            catchError((err) => {
              console.error('[TaxiException] polling error', err);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadExceptionData(): Observable<any> {
    return forkJoin({
      notReg: this.apiService.getTaxiException('NOTREG'),
      blackList: this.apiService.getTaxiException('BLACKLIST'),
    }).pipe(
      tap(({ notReg, blackList }) => {
        this.notReg = notReg;
        this.blackList = blackList;
      }),
    );
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
