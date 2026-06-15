import { CounterInfo } from '../../models/counter.model';
import {
  applyTypeClass,
  dayOfWeekLabel,
  dayOfWeekNumbers,
  flightCode,
  getApplyType,
  getStatusKind,
  hhmm,
  parseApplicationDate,
  timeRange,
  timeToDecimal,
} from './reset-shared';

/** 建立部分 CounterInfo(測試只需用到的欄位) */
function info(partial: Partial<CounterInfo>): CounterInfo {
  return {
    requestId: '',
    agent: '',
    airlineIata: '',
    flightNo: '',
    season: '',
    applyForPeriod: '',
    applicationDate: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    status: '',
    assignedBy: '',
    appliedBy: null,
    assignedCounterArea: '',
    departureIata: '',
    departure_time: '',
    reason: '',
    ...partial,
  };
}

describe('reset-shared', () => {
  describe('getApplyType', () => {
    it('applyForPeriod 含 ~ 視為指定期間 (range)', () => {
      expect(getApplyType(info({ applyForPeriod: '2026-07-01~2026-07-15' }))).toBe('range');
    });
    it('applyForPeriod 為空視為整季 (season)', () => {
      expect(getApplyType(info({ applyForPeriod: '' }))).toBe('season');
    });
  });

  describe('getStatusKind', () => {
    it('APPLY → pending', () => expect(getStatusKind('APPLY')).toBe('pending'));
    it('APPROVE → approved', () => expect(getStatusKind('APPROVE')).toBe('approved'));
    it('REJECT → rejected', () => expect(getStatusKind('REJECT')).toBe('rejected'));
    it('WITHDRAW → null(不顯示)', () => expect(getStatusKind('WITHDRAW')).toBeNull());
    it('未知/空 → null', () => {
      expect(getStatusKind('')).toBeNull();
      expect(getStatusKind('XXX')).toBeNull();
    });
  });

  describe('flightCode', () => {
    it('航空公司代碼 + 航班號', () => {
      expect(flightCode(info({ airlineIata: 'BR', flightNo: '196' }))).toBe('BR196');
    });
  });

  describe('hhmm', () => {
    it('截到 HH:mm', () => expect(hhmm('06:30:00')).toBe('06:30'));
    it('空字串回空', () => expect(hhmm('')).toBe(''));
    it('undefined 回空', () => expect(hhmm(undefined)).toBe(''));
  });

  describe('timeToDecimal', () => {
    it('08:30 → 8.5', () => expect(timeToDecimal('08:30')).toBe(8.5));
    it('06:00 → 6', () => expect(timeToDecimal('06:00')).toBe(6));
    it('帶秒亦可 22:00:00 → 22', () => expect(timeToDecimal('22:00:00')).toBe(22));
    it('空值 → NaN', () => expect(isNaN(timeToDecimal(''))).toBeTrue());
  });

  describe('timeRange', () => {
    it('組出 開始 ~ 結束', () => {
      expect(timeRange(info({ startTime: '06:30:00', endTime: '08:00:00' }))).toBe('06:30 ~ 08:00');
    });
    it('缺值回空字串', () => {
      expect(timeRange(info({ startTime: '', endTime: '08:00' }))).toBe('');
    });
  });

  describe('parseApplicationDate', () => {
    it('解析「2026/1/19 上午 12:00:00」', () => {
      const d = parseApplicationDate('2026/1/19 上午 12:00:00');
      expect(d).not.toBeNull();
      expect(d!.getFullYear()).toBe(2026);
      expect(d!.getMonth()).toBe(0); // 1 月
      expect(d!.getDate()).toBe(19);
    });
    it('無效輸入回 null', () => {
      expect(parseApplicationDate('')).toBeNull();
      expect(parseApplicationDate(undefined)).toBeNull();
    });
  });

  describe('dayOfWeekNumbers', () => {
    it('解析並排序、過濾 1~7 以外', () => {
      expect(dayOfWeekNumbers('3,1,2')).toEqual([1, 2, 3]);
      expect(dayOfWeekNumbers('0,8,5')).toEqual([5]); // 0/8 過濾
    });
    it('空字串回空陣列', () => expect(dayOfWeekNumbers('')).toEqual([]));
  });

  describe('dayOfWeekLabel', () => {
    it('一律以斜線分隔,不用 ~ 區段', () => {
      expect(dayOfWeekLabel('1,2,3,4')).toBe('一/二/三/四');
    });
    it('全選七天也用斜線', () => {
      expect(dayOfWeekLabel('1,2,3,4,5,6,7')).toBe('一/二/三/四/五/六/日');
    });
    it('不連續', () => expect(dayOfWeekLabel('2,4,6')).toBe('二/四/六'));
    it('空回空', () => expect(dayOfWeekLabel('')).toBe(''));
  });

  describe('applyTypeClass', () => {
    it('season → is-cyan', () => expect(applyTypeClass('season')).toBe('is-cyan'));
    it('range → is-orange', () => expect(applyTypeClass('range')).toBe('is-orange'));
  });
});
