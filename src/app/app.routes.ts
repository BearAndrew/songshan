import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { DailyFixedRouteOperationsComponent } from './features/daily-fixed-route-operations/daily-fixed-route-operations.component';
import { DailyFixedRouteOperationsForecastComponent } from './features/daily-fixed-route-operations-forecast/daily-fixed-route-operations-forecast.component';
import { DailyFlightAnalysisComponent } from './features/daily-flight-analysis/daily-flight-analysis.component';
import { DailyDomesticStandbyAnalysisComponent } from './features/daily-domestic-standby-analysis/daily-domestic-standby-analysis.component';
import { DailyAbnormalFlightInfoComponent } from './features/daily-abnormal-flight-info/daily-abnormal-flight-info.component';
import { RealtimePassengerVehicleDomesticComponent } from './features/realtime-passenger-vehicle/components/realtime-passenger-vehicle-domestic/realtime-passenger-vehicle-domestic.component';
import { RealtimePassengerVehicleInternationalComponent } from './features/realtime-passenger-vehicle/components/realtime-passenger-vehicle-international/realtime-passenger-vehicle-international.component';
import { TrafficForecastComponent } from './features/traffic-forecast/traffic-forecast.component';
import { ChartPageComponent } from './features/chart-page/chart-page.component';
import { DomesticRouteStandbyAnalysisComponent } from './features/domestic-route-standby-analysis/domestic-route-standby-analysis.component';
import { IntlCheckinCounterComponent } from './features/intl-checkin-counter/intl-checkin-counter.component';
import { TaxiModuleComponent } from './features/taxi-module/taxi-module.component';
import { DailyDomesticStandbyAnalysisDetailComponent } from './features/daily-domestic-standby-analysis/components/daily-domestic-standby-analysis-detail/daily-domestic-standby-analysis-detail.component';
import { RealtimePassengerVehicleComponent } from './features/realtime-passenger-vehicle/realtime-passenger-vehicle.component';
import { RealtimePassengerVehicleTaxiComponent } from './features/realtime-passenger-vehicle/components/realtime-passenger-vehicle-taxi/realtime-passenger-vehicle-taxi.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'daily-fixed-route-operations',
        pathMatch: 'full',
      },
      {
        path: 'daily-fixed-route-operations',
        component: DailyFixedRouteOperationsComponent,
        data: { title: '當日航班營運狀況', theme: 'dark' },
      },
      {
        path: 'daily-fixed-route-operations-forecast',
        component: DailyFixedRouteOperationsForecastComponent,
        data: { title: '當日航班即時營運狀況', theme: 'dark' },
      },
      {
        path: 'daily-international-flight-analysis',
        component: DailyFlightAnalysisComponent,
        data: {
          title: '當日定航出入境航班分析',
          theme: 'dark',
          type: 'international',
        },
      },
      {
        path: 'daily-domestic-flight-analysis',
        component: DailyFlightAnalysisComponent,
        data: {
          title: '當日國內線定航離到站航班分析',
          theme: 'dark',
          type: 'domestic',
        },
      },
      {
        path: 'daily-domestic-standby-analysis',
        component: DailyDomesticStandbyAnalysisComponent,
        data: { title: '當日國內線候補分析', theme: 'dark' },
      },
      {
        path: 'daily-domestic-standby-analysis/detail',
        component: DailyDomesticStandbyAnalysisDetailComponent,
        data: { title: '當日國內線候補分析', theme: 'dark' },
      },
      {
        path: 'daily-abnormal-flight-info',
        component: DailyAbnormalFlightInfoComponent,
        data: { title: '當日異常航班資訊', theme: 'dark' },
      },
      {
        path: 'realtime-passenger-vehicle',
        component: RealtimePassengerVehicleComponent,
        data: { title: '即時人車流', theme: 'dark' },
        children: [
          {
            path: '',
            redirectTo: 'international',
            pathMatch: 'full',
          },
          {
            path: 'international',
            component: RealtimePassengerVehicleInternationalComponent,
            data: { title: '即時人車流', theme: 'dark' },
          },
          {
            path: 'domestic',
            component: RealtimePassengerVehicleDomesticComponent,
            data: { title: '即時人車流', theme: 'dark' },
          },
          {
            path: 'taxi',
            component: RealtimePassengerVehicleTaxiComponent,
            data: { title: '即時人車流', theme: 'dark' },
          },
        ],
      },
      {
        path: 'traffic-forecast',
        component: TrafficForecastComponent,
        data: { title: '運量預報', theme: 'dark' },
      },
      {
        path: 'traffic-analysis',
        component: ChartPageComponent,
        data: { title: '運量分析', theme: 'dark' },
      },
      {
        path: 'fixed-route-traffic-analysis',
        component: ChartPageComponent,
        data: { title: '定航運量分析', theme: 'dark' },
      },
      {
        path: 'traffic-comparison-data',
        component: ChartPageComponent,
        data: { title: '運量對比資料', theme: 'dark' },
      },
      {
        path: 'fixed-route-traffic-comparison-data',
        component: ChartPageComponent,
        data: { title: '定航運量對比資料', theme: 'dark' },
      },
      {
        path: 'on-time-performance-analysis',
        component: ChartPageComponent,
        data: { title: '準點率分析', theme: 'dark' },
      },
      {
        path: 'flight-abnormal-analysis',
        component: ChartPageComponent,
        data: { title: '航班異常分析', theme: 'dark' },
      },
      {
        path: 'domestic-route-standby-analysis',
        component: DomesticRouteStandbyAnalysisComponent,
        data: { title: '國內航線候補分析', theme: 'dark' },
      },
      {
        path: 'intl-checkin-counter',
        component: IntlCheckinCounterComponent,
        data: { title: '國際線報到櫃檯模組', theme: 'dark' },
      },
      {
        path: 'taxi-module',
        component: TaxiModuleComponent,
        data: { title: '計程車模組', theme: 'dark' },
      },
    ],
  },
];
