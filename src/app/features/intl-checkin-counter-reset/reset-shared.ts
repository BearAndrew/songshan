import { CounterInfo } from '../../models/counter.model';

/** 申請別:整季(season/青) / 指定期間(range/橘) */
export type ApplyType = 'season' | 'range';

/** 設計用狀態:待審核 / 已核准 / 已駁回 */
export type StatusKind = 'pending' | 'approved' | 'rejected';

export const STATUS_LABEL: Record<StatusKind, string> = {
  pending: '待審核',
  approved: '已核准',
  rejected: '已駁回',
};

export const APPLY_TYPE_LABEL: Record<ApplyType, string> = {
  season: '整季',
  range: '指定期間',
};

/** 申請別判定:沿用既有規則(applyForPeriod 含 '~' → 指定期間) */
export function getApplyType(info: CounterInfo): ApplyType {
  return info.applyForPeriod && info.applyForPeriod.includes('~')
    ? 'range'
    : 'season';
}

/** 後端 status → 設計狀態;WITHDRAW(撤回)回傳 null(不顯示) */
export function getStatusKind(status: string): StatusKind | null {
  switch (status) {
    case 'APPLY':
      return 'pending';
    case 'APPROVE':
      return 'approved';
    case 'REJECT':
      return 'rejected';
    default:
      return null; // WITHDRAW / 空值
  }
}

/** 航班代碼 BR196 */
export function flightCode(info: CounterInfo): string {
  return `${info.airlineIata ?? ''}${info.flightNo ?? ''}`;
}

/** 'HH:mm:ss' / 'HH:mm' → 'HH:mm' */
export function hhmm(time?: string): string {
  if (!time) return '';
  return time.slice(0, 5);
}

/** 'HH:mm' → 小數時(08:30 → 8.5);失敗回 NaN */
export function timeToDecimal(time?: string): number {
  if (!time) return NaN;
  const [h, m] = time.slice(0, 5).split(':').map(Number);
  if (isNaN(h)) return NaN;
  return h + (isNaN(m) ? 0 : m) / 60;
}

/** 申請時段顯示 06:30 ~ 08:00 */
export function timeRange(info: CounterInfo): string {
  const s = hhmm(info.startTime);
  const e = hhmm(info.endTime);
  return s && e ? `${s} ~ ${e}` : '';
}

/** 解析後端「2026/1/19 上午 12:00:00」→ Date(僅取日期) */
export function parseApplicationDate(appDate?: string): Date | null {
  if (!appDate) return null;
  const datePart = appDate.split(' ')[0];
  const [y, m, d] = datePart.split('/').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

const WD_CHARS = ['', '一', '二', '三', '四', '五', '六', '日']; // 1=一 ... 7=日

/** dayOfWeek 'mon..sun' 對應(沿用既有:1=一/週一 ... 7=日/週日) */
export function dayOfWeekNumbers(dayOfWeek?: string): number[] {
  if (!dayOfWeek) return [];
  return dayOfWeek
    .split(',')
    .map((d) => Number(d.trim()))
    .filter((n) => n >= 1 && n <= 7)
    .sort((a, b) => a - b);
}

/** dayOfWeek → 星期標籤,一律以斜線分隔:一/二/三/四(不使用 ~ 區段) */
export function dayOfWeekLabel(dayOfWeek?: string): string {
  const nums = dayOfWeekNumbers(dayOfWeek);
  if (nums.length === 0) return '';
  return nums.map((n) => WD_CHARS[n]).join('/');
}

/** 設計看板色:season → cyan / range → orange */
export function applyTypeClass(type: ApplyType, prefix = 'is'): string {
  return `${prefix}-${type === 'range' ? 'orange' : 'cyan'}`;
}
