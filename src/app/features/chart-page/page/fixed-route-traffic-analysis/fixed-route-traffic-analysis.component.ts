import { Component } from '@angular/core';
import { ChartSearchBarComponent } from '../../components/chart-search-bar/chart-search-bar.component';
import { BarLinePageComponent } from '../../components/bar-line-page/bar-line-page.component';
import { ChartSearchBarForm } from '../../components/chart-search-bar/chart-search-bar.interface';
import {
  FlightTrafficAnalysisRequest,
  FlightTrafficAnalysisResponse,
} from '../../../../models/flight-traffic-analysis.model';
import { ApiService } from '../../../../core/services/api-service.service';
import { DataSetWithDataArray } from '../../../../core/lib/chart-tool';
import { CommonModule } from '@angular/common';
import { ChartPageRootComponent } from '../../chart-page-root';

@Component({
  selector: 'app-fixed-route-traffic-analysis',
  imports: [CommonModule, ChartSearchBarComponent, BarLinePageComponent],
  templateUrl: './fixed-route-traffic-analysis.component.html',
  styleUrl: './fixed-route-traffic-analysis.component.scss',
})
export class FixedRouteTrafficAnalysisComponent extends ChartPageRootComponent {
  onSubmit(form: ChartSearchBarForm) {
    this.formData = form;

    // 組裝 API payload
    const payload: FlightTrafficAnalysisRequest = {
      dateFrom:
        this.formatDate(form.startYear, form.startMonth, form.startDay) || '',
      dateTo: this.formatDate(form.endYear, form.endMonth, form.endDay) || '',
      type: form.flightClass || '',
      airline: form.airline! || '',
      direction: form.direction || '',
      peer: form.route! || '',
      flightType: form.flightType,
    };

    // 呼叫 API
    this.apiService.postFlightTrafficAnalysisSch(payload).subscribe({
      next: (res: FlightTrafficAnalysisResponse) => {
        this.handleFlightTrafficAnalysis(res);
      },
    });
  }

}
