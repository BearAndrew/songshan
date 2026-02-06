### 松山機場

#### 部署指令
```bash
ng build -c prod --base-href /acdm/ --deploy-url /acdm/

```

#### 專案架構圖
```
app/
├── shared/
│   └── layout/
│       └── main-layout/
│           └── main-layout.component.ts      ← 主版型
├── features/
│   ├── daily-fixed-route-operations/
│   │   └── daily-fixed-route-operations.component.ts      ← 當日航班營運狀況
│   ├── daily-fixed-route-operations-forecast/
│   │   └── daily-fixed-route-operations-forecast.component.ts      ← 當日航班即時營運狀況
│   ├── daily-flight-analysis/
│   │   └── daily-flight-analysis.component.ts
│   │       ├── daily-international-flight-analysis      ← 當日定航出入境航班分析
│   │       └── daily-domestic-flight-analysis           ← 當日國內線定航離到站航班分析
│   ├── daily-domestic-standby-analysis/
│   │   └── daily-domestic-standby-analysis.component.ts      ← 當日國內線候補分析
│   ├── daily-abnormal-flight-info/
│   │   └── daily-abnormal-flight-info.component.ts      ← 當日異常航班資訊
│   ├── realtime-passenger-vehicle-domestic/
│   │   └── realtime-passenger-vehicle-domestic.component.ts      ← 即時人車流（國內線）
│   ├── realtime-passenger-vehicle-international/
│   │   └── realtime-passenger-vehicle-international.component.ts      ← 即時人車流（國際線）
│   ├── traffic-forecast/
│   │   └── traffic-forecast.component.ts      ← 運量預報
│   ├── chart-page/
│   │   └── chart-page.component.ts
│   │       ├── traffic-analysis                  ← 運量分析
│   │       ├── fixed-route-traffic-analysis     ← 定航運量分析
│   │       ├── traffic-comparison-data          ← 運量對比資料
│   │       ├── fixed-route-traffic-comparison-data  ← 定航運量對比資料
│   │       ├── on-time-performance-analysis     ← 準點率分析
│   │       └── flight-abnormal-analysis        ← 航班異常分析
│   ├── domestic-route-standby-analysis/
│   │   └── domestic-route-standby-analysis.component.ts      ← 國內航線候補分析
│   ├── intl-checkin-counter/
│   │   └── intl-checkin-counter.component.ts      ← 國際線報到櫃檯模組
│   └── taxi-module/
│       └── taxi-module.component.ts      ← 計程車模組
```
