export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ko-KR');
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('ko-KR');
}
