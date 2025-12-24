export interface RealTimeTrafficFlowItem {
  locationName: string;          // 地點名稱（例：報到櫃檯）
  data: RealTimeTrafficPoint[];  // 即時人流資料
}

export interface RealTimeTrafficPoint {
  label: string;        // 標籤（例如櫃檯 / 通道編號）
  population: number;   // 人數
  waitTime: number;     // 等候時間（分鐘）
  image: string[];        // Base64 圖片
}
