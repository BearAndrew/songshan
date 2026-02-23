import { Component } from '@angular/core';
import { ChartSearchBarComponent } from '../../components/chart-search-bar/chart-search-bar.component';
import { BarLinePageComponent } from '../../components/bar-line-page/bar-line-page.component';
import { ChartSearchBarForm } from '../../components/chart-search-bar/chart-search-bar.interface';
import { CommonModule } from '@angular/common';
import { ChartPageRootComponent } from '../../chart-page-root';
import { OtpAnalysisRequest, OtpAnalysisResponse } from '../../../../models/otp-analysis.model';
import { fakeData } from './fake-data';


@Component({
  selector: 'app-on-time-performance',
  imports: [CommonModule, ChartSearchBarComponent, BarLinePageComponent],
  templateUrl: './on-time-performance.component.html',
  styleUrl: './on-time-performance.component.scss',
})
export class OnTimePerformanceComponent extends ChartPageRootComponent {

  onSubmit(form: ChartSearchBarForm) {
    this.formData = form;

    // 組裝 API payload
    const payload: OtpAnalysisRequest = {
      dateFrom:
        this.formatDate(
          this.formData.startYear,
          this.formData.startMonth,
          this.formData.startDay,
        ) || '',
      dateTo:
        this.formatDate(
          this.formData.endYear,
          this.formData.endMonth,
          this.formData.endDay,
        ) || '',
      type: this.formData.flightClass || '',
      airline: this.formData.airline! || '',
      direction: this.formData.flightType || '',
      peer: this.formData.route! || '',
      flightType: this.formData.flightType || '',
    };
    // this.handleOntimePerformance(fakeData)
    // return
    // 呼叫 API
    this.apiService.postOtpAnalysis(payload).subscribe({
      next: (res: OtpAnalysisResponse) => {
        this.handleOntimePerformance(res);
      }
    });
  }
}
