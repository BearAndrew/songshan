export function parseIsoToDate(value: string | undefined): Date {
  if (!value) return new Date();

  const date = new Date(value);

  return isNaN(date.getTime()) ? new Date() : date;
}
