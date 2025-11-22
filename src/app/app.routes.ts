import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { DailyFixedRouteOperationsComponent } from './features/daily-fixed-route-operations/daily-fixed-route-operations.component';
import { DailyFixedRouteOperationsForecastComponent } from './features/daily-fixed-route-operations-forecast/daily-fixed-route-operations-forecast.component';
import { DailyFlightAnalysisComponent } from './features/daily-flight-analysis/daily-flight-analysis.component';
import { DailyDomesticStandbyAnalysisComponent } from './features/daily-domestic-standby-analysis/daily-domestic-standby-analysis.component';
import { DailyAbnormalFlightInfoComponent } from './features/daily-abnormal-flight-info/daily-abnormal-flight-info.component';
import { RealtimePassengerVehicleDomesticComponent } from './features/realtime-passenger-vehicle-domestic/realtime-passenger-vehicle-domestic.component';
import { RealtimePassengerVehicleInternationalComponent } from './features/realtime-passenger-vehicle-international/realtime-passenger-vehicle-international.component';
import { TrafficForecastComponent } from './features/traffic-forecast/traffic-forecast.component';
import { ChartPageComponent } from './features/chart-page/chart-page.component';
import { DomesticRouteStandbyAnalysisComponent } from './features/domestic-route-standby-analysis/domestic-route-standby-analysis.component';
import { IntlCheckinCounterComponent } from './features/intl-checkin-counter/intl-checkin-counter.component';
import { TaxiModuleComponent } from './features/taxi-module/taxi-module.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'daily-fixed-route-operations', pathMatch: 'full' },
      {
        path: 'daily-fixed-route-operations',
        title: '當日定航營運狀況',
        component: DailyFixedRouteOperationsComponent,
        data: { theme: 'light' },
      },
      {
        path: 'daily-fixed-route-operations-forecast',
        title: '當日定航營運狀況（含預報）',
        component: DailyFixedRouteOperationsForecastComponent,
        data: { theme: 'light' },
      },
      {
        path: 'daily-international-flight-analysis',
        component: DailyFlightAnalysisComponent,
        title: '當日國際兩岸線定航出入境航班分析',
        data: { theme: 'light', type: 'international' },
      },
      {
        path: 'daily-domestic-flight-analysis',
        component: DailyFlightAnalysisComponent,
        title: '當日國內線定航離到站航班分析',
        data: { theme: 'light', type: 'domestic' },
      },
      {
        path: 'daily-domestic-standby-analysis',
        title: '當日國內線候補分析',
        component: DailyDomesticStandbyAnalysisComponent,
        data: { theme: 'light' },
      },
      {
        path: 'daily-abnormal-flight-info',
        title: '當日異常航班資訊',
        component: DailyAbnormalFlightInfoComponent,
        data: { theme: 'dark' },
      },
      {
        path: 'realtime-pax-vehicle-domestic',
        title: '即時人車流（國內線）',
        component: RealtimePassengerVehicleDomesticComponent,
        data: { theme: 'dark' },
      },
      {
        path: 'realtime-pax-vehicle-international',
        title: '即時人車流（國際線）',
        component: RealtimePassengerVehicleInternationalComponent,
        data: { theme: 'dark' },
      },
      {
        path: 'traffic-forecast',
        title: '運量預報',
        component: TrafficForecastComponent,
        data: { theme: 'light' },
      },
      {
        path: 'traffic-analysis',
        title: '運量分析',
        component: ChartPageComponent,
        data: { theme: 'light' },
      },
      {
        path: 'fixed-route-traffic-analysis',
        title: '定航運量分析',
        component: ChartPageComponent,
        data: { theme: 'light' },
      },
      {
        path: 'traffic-comparison-data',
        title: '運量對比資料',
        component: ChartPageComponent,
        data: { theme: 'dark' },
      },
      {
        path: 'fixed-route-traffic-comparison-data',
        title: '定航運量對比資料',
        component: ChartPageComponent,
        data: { theme: 'dark' },
      },
      {
        path: 'on-time-performance-analysis',
        title: '準點率分析',
        component: ChartPageComponent,
        data: { theme: 'light' },
      },
      {
        path: 'flight-abnormal-analysis',
        title: '航班異常分析',
        component: ChartPageComponent,
        data: { theme: 'dark' },
      },
      {
        path: 'domestic-route-standby-analysis',
        title: '國內航線候補分析',
        component: DomesticRouteStandbyAnalysisComponent,
        data: { theme: 'light' },
      },
      {
        path: 'intl-checkin-counter',
        title: '國際線報到櫃檯模組',
        component: IntlCheckinCounterComponent,
        data: { theme: 'light' },
      },
      {
        path: 'taxi-module',
        title: '計程車模組',
        component: TaxiModuleComponent,
        data: { theme: 'dark' },
      },
    ],
  },
];
