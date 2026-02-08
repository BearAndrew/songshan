import { Component } from '@angular/core';
import { ChartSearchBarComponent } from '../../components/chart-search-bar/chart-search-bar.component';
import { BarLinePageComponent } from '../../components/bar-line-page/bar-line-page.component';
import { ChartSearchBarForm } from '../../components/chart-search-bar/chart-search-bar.interface';
import { CommonModule } from '@angular/common';
import { ChartPageRootComponent } from '../../chart-page-root';
import { YearlyTrafficAnalysisRequest, YearlyTrafficAnalysisResponse } from '../../../../models/yearly-traffic-analysis.model';

@Component({
  selector: 'app-traffic-comparison',
  imports: [CommonModule, ChartSearchBarComponent, BarLinePageComponent],
  templateUrl: './traffic-comparison.component.html',
  styleUrl: './traffic-comparison.component.scss',
})
export class TrafficComparisonComponent extends ChartPageRootComponent {
  onSubmit(form: ChartSearchBarForm) {
    this.formData = form;
    if (this.formData.firstYear === null || this.formData.secondYear === null) {
      return;
    }
    this.firstDateRangeLabel = this.formData.firstYear?.toString() + '年' || '';
    this.secondDateRangeLabel =
      this.formData.secondYear?.toString() + '年' || '';
    if (this.formData.thirdYear) {
      this.thirdDateRangeLabel =
        this.formData.thirdYear?.toString() + '年' || '';
    }

    // 組裝 API payload
    const payload: YearlyTrafficAnalysisRequest = {
      year1: this.formData.firstYear?.toString() || '',
      year2: this.formData.secondYear?.toString() || '',
      year3: this.formData.thirdYear?.toString() || '',
      type: this.formData.flightClass || '',
      airline: this.formData.airline! || '',
      direction: this.formData.direction || '',
      peer: this.formData.route! || '',
      flightType: this.formData.flightType || '',
    };

    // 呼叫 API
    this.apiService.postYearlyTrafficAnalysis(payload).subscribe({
      next: (res: YearlyTrafficAnalysisResponse[]) => {
        this.handleYearFlightTrafficAnalysis(res);
      },
    });
  }
}
