import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import {
  OVERLAY_DATA,
  OVERLAY_RESULT,
} from '../../../shared/components/message-dialog/message-dialog.inject-token';
import { ApiService } from '../../../core/services/api-service.service';
import { CounterInfo } from '../../../models/counter.model';
import {
  ApplicationFormData,
  ApplicationFormModalComponent,
  ApplicationFormResult,
} from './application-form-modal.component';

function info(p: Partial<CounterInfo>): CounterInfo {
  return {
    requestId: '', agent: '', airlineIata: '', flightNo: '', season: '',
    applyForPeriod: '', applicationDate: '', dayOfWeek: '', startTime: '',
    endTime: '', status: '', assignedBy: '', appliedBy: null,
    assignedCounterArea: '', departureIata: '', departure_time: '', reason: '',
    ...p,
  };
}

function setup(data: ApplicationFormData) {
  const result$ = new Subject<ApplicationFormResult | null>();
  const apiStub = {
    getAirportListByTypeAirline: () => of([{ iata: 'GMP', name_zhTW: '金浦' }]),
    getSeasons: () => of([{ season: '2026夏季', startDate: '2026/06/08', endDate: '2026/10/25' }]),
  };

  TestBed.configureTestingModule({
    imports: [ApplicationFormModalComponent],
    providers: [
      { provide: OVERLAY_DATA, useValue: data },
      { provide: OVERLAY_RESULT, useValue: result$ },
      { provide: ApiService, useValue: apiStub },
    ],
  });
  const fixture = TestBed.createComponent(ApplicationFormModalComponent);
  fixture.detectChanges(); // 觸發 ngOnInit
  return { comp: fixture.componentInstance, result$ };
}

describe('ApplicationFormModalComponent', () => {
  describe('新增 (mode=new)', () => {
    it('欄位不完整時 submit 不送出結果', () => {
      const { comp, result$ } = setup({ mode: 'new', agent: 'BR' });
      let emitted: ApplicationFormResult | null | undefined;
      result$.subscribe((v) => (emitted = v));
      comp.submit();
      expect(comp.submitted).toBeTrue();
      expect(emitted).toBeUndefined(); // 未 emit
    });

    it('填妥後送出正確 payload(週日轉 0、時間補秒)', () => {
      const { comp, result$ } = setup({ mode: 'new', agent: 'BR' });
      let res: ApplicationFormResult | null = null;
      result$.subscribe((v) => (res = v));

      comp.flightNo = 'BR196';
      comp.departureIata = 'GMP';
      comp.depHH = '08'; comp.depMM = '30';
      comp.openHH = '06'; comp.openMM = '30';
      comp.closeHH = '08'; comp.closeMM = '00';
      comp.weekdays = new Set([1, 7]); // 一、日 → '1,0'
      comp.dateType = 'season';
      comp.season = '2026夏季';

      comp.submit();

      expect(res).toBeTruthy();
      expect(res!.mode).toBe('new');
      const payload: any = res!.payload;
      expect(payload.airline_iata).toBe('BR');
      expect(payload.flight_no).toBe('196');
      expect(payload.day_of_week).toBe('1,0');
      expect(payload.start_time).toBe('06:30:00');
      expect(payload.end_time).toBe('08:00:00');
      expect(payload.departure_time).toBe('08:30:00');
      expect(payload.departureIata).toBe('GMP');
      expect(payload.season).toBe('2026夏季');
    });
  });

  describe('異動 (mode=modify)', () => {
    it('依既有資料 prefill', () => {
      const { comp } = setup({
        mode: 'modify',
        info: info({
          requestId: 'R1', airlineIata: 'BR', flightNo: '196',
          startTime: '06:30:00', endTime: '08:00:00', dayOfWeek: '1,2',
          departureIata: 'GMP', departure_time: '08:30:00', applyForPeriod: '',
        }),
      });
      expect(comp.flightNo).toBe('BR196');
      expect(comp.dateType).toBe('season'); // 無 ~ → 整季
      expect(comp.openHH).toBe('06');
      expect(comp.closeMM).toBe('00');
      expect([...comp.weekdays].sort()).toEqual([1, 2]);
    });

    it('整季異動需生效起始日,填妥後送出 modify payload', () => {
      const { comp, result$ } = setup({
        mode: 'modify',
        info: info({
          requestId: 'R1', airlineIata: 'BR', flightNo: '196',
          startTime: '06:30:00', endTime: '08:00:00', dayOfWeek: '1,2',
          departureIata: 'GMP', departure_time: '08:30:00',
        }),
      });
      let res: ApplicationFormResult | null = null;
      result$.subscribe((v) => (res = v));

      // 未填生效起始日 → 不送出
      comp.submit();
      expect(res).toBeNull();

      comp.effectiveStart = new Date(2026, 6, 13); // 2026-07-13
      comp.submit();

      expect(res).toBeTruthy();
      expect(res!.mode).toBe('modify');
      const payload: any = res!.payload;
      expect(payload.requestId).toBe('R1');
      expect(payload.dayOfWeek).toBe('1,2');
      expect(payload.startDate).toBe('2026-07-13');
      expect(payload.endDate).toBe('');
    });
  });
});
