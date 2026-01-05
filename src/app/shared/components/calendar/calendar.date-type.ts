export interface CalendarDateType {
  date: Date; // 日期
  shift: Shift; // 時段
}

export type Shift = 'morning' | 'afternoon'

/** 排班對應 */
export interface ShiftTime {
  value: Shift;
  label: '8:00 - 12:00' | '15:00 - 19:00';
}

export const SHIFT_TIME_OPTIONS: ShiftTime[] = [
  { value: 'morning', label: '8:00 - 12:00' },
  { value: 'afternoon', label: '15:00 - 19:00' },
];
