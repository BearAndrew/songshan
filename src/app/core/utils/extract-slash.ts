export function extractAfterSlash(value: string): string {
  if (!value || !value.includes('/')) {
    return value;
  }

  const parts = value.split('/');
  if (parts.length < 2) {
    return value;
  }

  return parts[1];
}
