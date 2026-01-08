import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlightRow } from '../../core/interface/domestic-route-standby-analysis.interface';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { Option } from '../../shared/components/dropdown/dropdown.component';
import {
  HistoricStandbyAirlineStat,
  HistoricStandbySummaryItem,
} from '../../models/historic-standby-summary.model';

@Component({
  selector: 'app-domestic-route-standby-analysis',
  imports: [CommonModule, RouterModule, DropdownComponent],
  templateUrl: './domestic-route-standby-analysis.component.html',
  styleUrl: './domestic-route-standby-analysis.component.scss',
})
export class DomesticRouteStandbyAnalysisComponent {
  tableData: FlightRow[] = [];
  MOCK_STANDBY_SUMMARY: HistoricStandbySummaryItem[] = [
    {
      destinationName: 'Tokyo Narita',
      destinationId: 'NRT',
      currWeather: {
        iata: 'NRT',
        temperature: '8', // °C (string)
        weatherStatus: 'Cloudy',
        visibility: '10km',
        cloudLevel: 'Low',
        windspeed: '12 km/h',
      },
      airlines: [
        {
          airlineIATA: '',
          airlineName: '',
          regtotal: 220,
          fetchuptotal: 192,
          passtotal: 190,
          flytotal: 185,
          flyRate: 95.0,
        },
        {
          airlineIATA: 'CI',
          airlineName: 'China Airlines',
          regtotal: 120,
          fetchuptotal: 110,
          passtotal: 105,
          flytotal: 98,
          flyRate: 81.7,
        },
        {
          airlineIATA: 'BR',
          airlineName: 'EVA Air',
          regtotal: 100,
          fetchuptotal: 92,
          passtotal: 90,
          flytotal: 85,
          flyRate: 85.0,
        },
      ],
    },
    {
      destinationName: 'Hong Kong',
      destinationId: 'HKG',
      currWeather: {
        iata: 'HKG',
        temperature: '18',
        weatherStatus: 'Sunny',
        visibility: '15km',
        cloudLevel: 'None',
        windspeed: '8 km/h',
      },
      airlines: [
        {
          airlineIATA: '',
          airlineName: '',
          regtotal: 220,
          fetchuptotal: 192,
          passtotal: 190,
          flytotal: 185,
          flyRate: 95.0,
        },
        {
          airlineIATA: 'CI',
          airlineName: 'China Airlines',
          regtotal: 140,
          fetchuptotal: 135,
          passtotal: 130,
          flytotal: 122,
          flyRate: 87.1,
        },
        {
          airlineIATA: 'CX',
          airlineName: 'Cathay Pacific',
          regtotal: 160,
          fetchuptotal: 150,
          passtotal: 148,
          flytotal: 140,
          flyRate: 87.5,
        },
      ],
    },
  ];

  // 年、月、日 options
  yearOptions: Option[] = [];
  monthOptions: Option[] = [];
  startDayOptions: Option[] = [];
  endDayOptions: Option[] = [];

  formData: {
    startYear: number | null;
    startMonth: number | null;
    startDay: number | null;
    endYear: number | null;
    endMonth: number | null;
    endDay: number | null;
  } = {
    startYear: null,
    startMonth: null,
    startDay: null,
    endYear: null,
    endMonth: null,
    endDay: null,
  };

  dateFrom: string = '';
  dateTo: string = '';

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    // if (this.commonService.realAirportValue !== -1) {
    //   this.getStandbySummary(this.commonService.realAirportValue);
    // }
    // //預設取得不分機場總數
    // this.commonService.getSelectedAirport().subscribe((airportId) => {
    //   // 根據選擇的機場ID執行相應的操作，例如重新載入資料
    //   if (airportId === -1) {
    //     return;
    //   }
    //   this.getStandbySummary(airportId);
    // });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();

    // 今年 ~ 往回 10 年（共 11 年）
    this.yearOptions = Array.from({ length: 11 }, (_, i) => {
      const year = currentYear - i;
      return { label: year.toString(), value: year };
    });

    // 月份 1~12
    this.monthOptions = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return { label: month.toString().padStart(2, '0'), value: month };
    });
  }

  getStandbySummary(value: number) {
    // const code = this.commonService.getAirportCodeById(value);
    this.dateFrom =
      this.formatDate(
        this.formData.startYear,
        this.formData.startMonth,
        this.formData.startDay
      ) || '';
    this.dateTo =
      this.formatDate(
        this.formData.endYear,
        this.formData.endMonth,
        this.formData.endDay
      ) || '';
    const payload = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
    };

    // console.log('dateFrom: ', payload.dateFrom, ' , dateTo: ', payload.dateTo);
    // console.log(this.MOCK_STANDBY_SUMMARY);
    // this.setTableData(this.MOCK_STANDBY_SUMMARY);
    // return;

    this.apiService.postHistoricStandbySummary(payload).subscribe({
      next: (res) => {
        this.setTableData(res);
      },
    });
  }

  setTableData(data: HistoricStandbySummaryItem[]) {
    this.tableData = [];
    data.forEach((item, index) => {
      const rawTemp = item.currWeather?.temperature;
      const tempValue = Number(String(rawTemp).match(/-?\d+/)?.[0] ?? 0);
      this.tableData.push({
        route: item.destinationName,
        weather: {
          temperature: tempValue + '°C',
          description: item.currWeather?.weatherStatus,
          visibility: item.currWeather?.visibility,
          altitude: item.currWeather?.cloudLevel,
          windSpeed: item.currWeather?.windspeed,
        },
        details: [],
        routerParam: item.currWeather?.iata,
      });

      const airlines = [...item.airlines].slice(0, 3);

      const emptyDetail: HistoricStandbyAirlineStat = {
        airlineIATA: '',
        airlineName: '',
        regtotal: '\u00A0',
        fetchuptotal: '\u00A0',
        passtotal: '\u00A0',
        flytotal: '\u00A0',
        flyRate: '\u00A0',
      };
      while (airlines.length < 3) {
        airlines.push(emptyDetail);
      }

      airlines.forEach((detail) => {
        this.tableData[index].details.push({
          airlineIATA: detail.airlineIATA,
          airlineName: detail.airlineName,
          regtotal: detail.regtotal,
          fetchuptotal: detail.fetchuptotal,
          passtotal: detail.passtotal,
          flytotal: detail.flytotal,
          flyRate: detail.flyRate,
        });
      });
    });

    // 計算最大值
    const toNumberOrZero = (value: unknown): number =>
      typeof value === 'number' ? value : Number(value) || 0;

    this.tableData.forEach((group) => {
      group.maxReg = Math.max(
        ...group.details.map((d) => toNumberOrZero(d.regtotal))
      );

      group.maxFetchup = Math.max(
        ...group.details.map((d) => toNumberOrZero(d.fetchuptotal))
      );

      group.maxPass = Math.max(
        ...group.details.map((d) => toNumberOrZero(d.passtotal))
      );

      group.maxFly = Math.max(
        ...group.details.map((d) => toNumberOrZero(d.flytotal))
      );

      group.maxFlyRate = Math.max(
        ...group.details.map((d) => toNumberOrZero(d.flyRate))
      );
    });
  }

  private formatDate(
    year?: number | null,
    month?: number | null,
    day?: number | null
  ): string {
    const y = year ?? 0;
    const m = month ? String(month).padStart(2, '0') : '0';
    const d = day ? String(day).padStart(2, '0') : '0';

    return `${y}-${m}-${d}`;
  }

  // 計算某年某月的天數
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  // 生成日選單
  generateDayOptions(year: number, month: number): Option[] {
    if (!year || !month) return [];
    const days = this.getDaysInMonth(year, month);
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      return { label: day.toString().padStart(2, '0'), value: day };
    });
  }

  // 選擇事件
  onSelectionChange(field: keyof typeof this.formData, option: Option) {
    this.formData[field] = option.value;
  }

  // 當年份或月份改變時更新日選單
  onMonthOrYearChange(
    type: 'start' | 'end',
    year: number | null,
    month: number | null
  ) {
    if (!year || !month) return;

    // 生成當月日選項
    const options = this.generateDayOptions(year, month);

    if (type === 'start') {
      this.startDayOptions = options;

      // 如果原本的日期超過當月最大天數，清空
      if (
        typeof this.formData.startDay === 'number' &&
        this.formData.startDay > options.length
      ) {
        this.formData.startDay = null;
      }
    } else {
      this.endDayOptions = options;

      if (
        typeof this.formData.endDay === 'number' &&
        this.formData.endDay > options.length
      ) {
        this.formData.endDay = null;
      }
    }
  }

  /** 確認按鈕，呼叫查詢api */
  onConfirm() {
    this.getStandbySummary(0);
  }
}
