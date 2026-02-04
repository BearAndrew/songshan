export interface BaggageTimeItem {
  flightNo: string;                // 航班號
  departurePort: string;           // 出發地
  sta: string;                     // 表定時間 (Scheduled Time of Arrival)
  eta: string;                     // 預計抵達 (Estimated Time of Arrival)
  ata: string;                     // 實際抵達 (Actual Time of Arrival)
  ibt: string;                     // 航班抵達

  firstBagDeplane: string;         // 第一件行李下機時間
  firstBagArriveCarousel: string;  // 第一件行李到轉盤時間
  firstBagOnCarousel: string;      // 第一件行李上轉盤時間
  firstBagInXray: string;          // 第一件行李進X光機時間
  firstBagOutXray: string;         // 第一件行李出X光機時間

  lastBagDeplane: string;          // 最後一件行李下機時間
  lastBagArriveCarousel: string;   // 最後一件行李到轉盤時間
  lastBagOnCarousel: string;       // 最後一件行李上轉盤時間
  lastBagInXray: string;           // 最後一件行李進X光機時間
  lastBagOutXray: string;          // 最後一件行李出X光機時間

  // === 旅客（第一位） ===
  paxFirstGate: string;            // 入境登機門
  paxFirstImmigration: string;     // 證照查驗區
  paxFirstCarousel: string;        // 行李轉盤區查驗區
  paxFirstArrCustom: string;       // 進入海關區
  paxFirstExitCustom: string;      // 離開海關區
  paxFirstTaxi: string;            // 計程車區

  // === 旅客（最後一位） ===
  paxLastGate: string;             // 入境登機門
  paxLastImmigration: string;      // 證照查驗區
  paxLastCarousel: string;         // 行李轉盤區查驗區
  paxLastArrCustom: string;        // 進入海關區
  paxLastExitCustom: string;       // 離開海關區
  paxLastTaxi: string;             // 計程車區
}
