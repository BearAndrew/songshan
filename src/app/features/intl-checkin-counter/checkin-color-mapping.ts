export enum CounterStatus {
  WITHDRAW = '撤銷',
  APPLY = '核准中',
  APPROVE = '已核准',
  REJECT = '駁回',
}

export const STATUS_COLOR_MAP: Record<string, string> = {
  [CounterStatus.WITHDRAW]: '#9CA3AF', // 灰
  [CounterStatus.APPLY]: '#3B82F6',    // 藍
  [CounterStatus.APPROVE]: '#22C55E',  // 綠
  [CounterStatus.REJECT]: '#EF4444',   // 紅
};
