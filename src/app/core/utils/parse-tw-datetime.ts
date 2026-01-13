export function parseTwDateTime(value: string | undefined): Date {
  if (!value) return new Date();

  // ex: 2026/3/29 上午 12:00:00
  const match = value.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s(上午|下午)\s(\d{1,2}):(\d{2}):(\d{2})$/
  );

  if (!match) return new Date();

  let [, year, month, day, ampm, hour, minute, second] = match;

  let h = Number(hour);

  // 上午 / 下午 處理
  if (ampm === '下午' && h < 12) h += 12;
  if (ampm === '上午' && h === 12) h = 0;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    h,
    Number(minute),
    Number(second)
  );
}
