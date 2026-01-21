import { ApiService } from './../../../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { TabType } from '../../../../core/enums/tab-type.enum';
import { Option } from '../../../../shared/components/dropdown/dropdown.component';
import { Airport } from '../../../../models/airport.model';
import { Airline } from '../../../../models/airline.model';
import { ChartSearchBarForm } from './chart-search-bar.interface';

interface Tab {
  label: string;
  value: TabType;
}

@Component({
  selector: 'app-chart-search-bar',
  imports: [CommonModule, DropdownComponent],
  templateUrl: './chart-search-bar.component.html',
  styleUrl: './chart-search-bar.component.scss',
})
export class ChartSearchBarComponent {
  /** 是否為定航，預設為false */
  @Input() isSchedule = false;
  /** 是否顯示選擇日期，反之顯示年份，預設為true  */
  @Input() isDate = true;
  /** 是否顯示選擇日期，反之顯示年份，預設為true  */
  @Output() formChange = new EventEmitter<ChartSearchBarForm>();
  @Output() submit = new EventEmitter<ChartSearchBarForm>();

  tabList: Tab[] = [
    {
      label: '國際兩岸線',
      value: TabType.NONDOMESTIC,
    },
    {
      label: '國際線',
      value: TabType.INTL,
    },
    {
      label: '兩岸線',
      value: TabType.CROSSSTRAIT,
    },
    {
      label: '國內線',
      value: TabType.DOMESTIC,
    },
    {
      label: '總數',
      value: TabType.ALL,
    },
  ];

  // 年、月、日 options
  yearOptions: Option[] = [];
  monthOptions: Option[] = [];
  startDayOptions: Option[] = [];
  endDayOptions: Option[] = [];
  // end 的年份與月份可選清單（會依 start 限制）
  endYearOptions: Option[] = [];
  endMonthOptions: Option[] = [];

  // 航點、航班類別、航空公司、飛航類型 options
  routeOptions: Option[] = [];
  airlineOptions: Option[] = [];
  flightClassOptions: Option[] = [
    { label: '全部', value: '' },
    { label: '定航', value: 'SCHEDULE' },
    { label: '商務機', value: 'BJ' },
    { label: '軍機', value: 'MILITARY' },
    { label: '其他', value: 'OTHER' },
  ];
  directionOptions: Option[] = [
    { label: '全部', value: '' },
    { label: '出境', value: 'OUTBOUND' },
    { label: '入境', value: 'INBOUND' },
  ];

  // 目前表單值
  formData: ChartSearchBarForm = {
    startYear: null,
    startMonth: null,
    startDay: null,
    endYear: null,
    endMonth: null,
    endDay: null,
    firstYear: null,
    secondYear: null,
    thirdYear: null,
    route: '',
    flightClass: null,
    airline: null,
    direction: '',
    flightType: TabType.NONDOMESTIC,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.formData.flightClass = this.isSchedule ? 'SCHEDULE' : '';

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

  // 初始時 end options 跟完整 options 一致
  this.endYearOptions = this.yearOptions.slice();
  this.endMonthOptions = this.monthOptions.slice();

    // 取得機場清單
    this.apiService.getAirportList().subscribe((res: Airport[]) => {
      this.routeOptions = res.map((airport) => ({
        label: airport.name_zhTW,
        value: airport.iata,
      }));
      this.routeOptions.unshift({ label: '全部', value: '' });
    });

    this.getAirlineList();
  }

  /** 取得航空公司清單，更新航空公司選單資料，並回傳變更事件 */
  getAirlineList() {
    this.apiService
      .getAirlineList(this.formData.flightType || '')
      .subscribe((res: Airline[]) => {
        this.airlineOptions = res.map((airline) => ({
          label: airline.name_zhTW,
          value: airline.iata,
        }));
        this.airlineOptions.unshift({ label: '全部', value: '' });
        this.formData.airline = '';
        this.formChange.emit(this.formData);
      });
  }

  // 生成日選單
  generateDayOptions(year: number, month: number): Option[] {
    if (!year || !month) return [];
    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      return { label: day.toString().padStart(2, '0'), value: day };
    });
  }

  // 當年份或月份改變時更新日選單
  onMonthOrYearChange(
    type: 'start' | 'end',
    year: number | null,
    month: number | null,
  ) {
  // MAX_END_YEARS 為內部常數（可改成變數以供後續調整）
  const MAX_END_YEARS = 2;

  // 處理 start 的變動（可能影響 end 的可選範圍）
    if (type === 'start') {
      // 生成起始日選項（若 year/month 任一為 null，清空）
      this.startDayOptions = year && month ? this.generateDayOptions(year, month) : [];

      if (
        typeof this.formData.startDay === 'number' &&
        this.startDayOptions.length &&
        this.formData.startDay > this.startDayOptions.length
      ) {
        this.formData.startDay = null;
      }

      // 限制結束年份：endYear 必須在 [startYear, startYear + MAX_END_YEARS]
      if (year != null) {
  const startYear = Number(year);
  const startMonth = typeof month === 'number' ? month : this.formData.startMonth;
  const startDay = typeof this.formData.startDay === 'number' ? this.formData.startDay : null;

  const maxYear = startYear + MAX_END_YEARS;
  // 如果有 startMonth 且有 startDay，計算精確上界日期；
  // 如果只有 startMonth，則上界到 maxYear 同月（但日不限制到 startDay）。
  const hasStartMonth = startMonth != null;
  const hasStartDay = startDay != null;
  const maxDate = hasStartMonth && hasStartDay ? new Date(startYear + MAX_END_YEARS, startMonth - 1, startDay) : null;
  const maxMonth = hasStartMonth ? startMonth : null;

        this.endYearOptions = this.yearOptions.filter((o) => {
          const v = Number(o.value);
          return v >= startYear && v <= maxYear;
        });

  // 若目前 endYear 超過上界，清空 end 的年/月/日
  if (typeof this.formData.endYear === 'number' && this.formData.endYear > maxYear) {
          this.formData.endYear = null;
          this.formData.endMonth = null;
          this.formData.endDay = null;
          this.endMonthOptions = [];
          this.endDayOptions = [];
        }

        // 若目前 endYear 小於 startYear，清空 end 的年/月/日
        if (typeof this.formData.endYear === 'number' && this.formData.endYear < year) {
          this.formData.endYear = null;
          this.formData.endMonth = null;
          this.formData.endDay = null;
          this.endMonthOptions = [];
          this.endDayOptions = [];
        }

        // 如果 endYear 與 startYear 相同，限制 endMonth >= startMonth
        if (this.formData.endYear === startYear) {
          if (hasStartMonth) {
            const minMonth = startMonth || 1;
            this.endMonthOptions = this.monthOptions.filter((m) => Number(m.value) >= Number(minMonth));

            if (typeof this.formData.endMonth === 'number' && this.formData.endMonth < minMonth) {
              this.formData.endMonth = null;
              this.formData.endDay = null;
              this.endDayOptions = [];
            }

            // 若 endMonth 已選，且為同月，若有 startDay 則限制下限日；否則允許該月所有日
            if (this.formData.endMonth != null) {
              if (hasStartDay && this.formData.endMonth === startMonth) {
                const minDay = startDay!;
                const allDays = this.generateDayOptions(startYear, this.formData.endMonth);
                this.endDayOptions = allDays.filter((d) => Number(d.value) >= Number(minDay));
                if (typeof this.formData.endDay === 'number' && this.formData.endDay < minDay) {
                  this.formData.endDay = null;
                }
              } else {
                this.endDayOptions = this.generateDayOptions(this.formData.endYear!, this.formData.endMonth!);
              }
            }
          } else {
            this.endMonthOptions = this.monthOptions.slice();
          }
        } else if (this.formData.endYear === maxYear) {
          // 若 endYear 為上界年，且有 startMonth，限制 endMonth <= maxMonth
          if (hasStartMonth) {
            const boundaryMonth = Number(startMonth);
            // filter months <= startMonth
            this.endMonthOptions = this.monthOptions.filter((m) => Number(m.value) <= boundaryMonth);
            if (typeof this.formData.endMonth === 'number' && this.formData.endMonth > boundaryMonth) {
              this.formData.endMonth = null;
              this.formData.endDay = null;
              this.endDayOptions = [];
            }

            // 若選上界月，且有 startDay，限制日上界
            if (this.formData.endMonth === boundaryMonth) {
              if (hasStartDay && maxDate) {
                const maxDay = maxDate.getDate();
                const allDays = this.generateDayOptions(this.formData.endYear!, this.formData.endMonth!);
                this.endDayOptions = allDays.filter((d) => Number(d.value) <= maxDay);
                if (typeof this.formData.endDay === 'number' && this.formData.endDay > maxDay) {
                  this.formData.endDay = null;
                }
              } else {
                // 無 startDay，該月日全部可選
                this.endDayOptions = this.generateDayOptions(this.formData.endYear!, this.formData.endMonth!);
              }
            } else if (this.formData.endMonth != null) {
              // 若選的是早於上界月的月份，該月日全部可選
              this.endDayOptions = this.generateDayOptions(this.formData.endYear!, this.formData.endMonth!);
            }
          } else {
            this.endMonthOptions = this.monthOptions.slice();
          }
        } else {
          // 否則恢復完整月份清單
          this.endMonthOptions = this.monthOptions.slice();
        }
      } else {
        this.endYearOptions = this.yearOptions.slice();
        this.endMonthOptions = this.monthOptions.slice();
      }
    } else {
      // 處理 end 的變動
      // 先計算日選項（稍後可能被上下界修正）
      this.endDayOptions = year && month ? this.generateDayOptions(year, month) : [];

      // 若 startYear 存在，檢查 endYear 是否超出上界（使用內部 MAX_END_YEARS）
      if (this.formData.startYear != null && typeof year === 'number') {
        const startYear = Number(this.formData.startYear);
        const startMonth = this.formData.startMonth;
        const startDay = this.formData.startDay;
        const maxYear = startYear + MAX_END_YEARS;
        const maxDate = startMonth != null && startDay != null ? new Date(startYear + MAX_END_YEARS, startMonth - 1, startDay) : null;

        if (year > maxYear) {
          // 超出上界，清空 end 的年/月/日
          this.formData.endYear = null;
          this.formData.endMonth = null;
          this.formData.endDay = null;
          this.endMonthOptions = [];
          this.endDayOptions = [];
          this.formChange.emit(this.formData);
          return;
        }

        // 若 end 在上界年，限制月份與日期
        if (year === maxYear && maxDate) {
          const maxMonth = maxDate.getMonth() + 1;
          this.endMonthOptions = this.monthOptions.filter((m) => Number(m.value) <= maxMonth);
          if (typeof this.formData.endMonth === 'number' && this.formData.endMonth > maxMonth) {
            this.formData.endMonth = null;
            this.formData.endDay = null;
            this.endDayOptions = [];
          }

          if (this.formData.endMonth === maxMonth) {
            const maxDay = maxDate.getDate();
            const allDays = this.generateDayOptions(year, this.formData.endMonth!);
            this.endDayOptions = allDays.filter((d) => Number(d.value) <= maxDay);
            if (typeof this.formData.endDay === 'number' && this.formData.endDay > maxDay) {
              this.formData.endDay = null;
            }
          }
        }
      }

      // 若 startYear 存在且與 endYear 相同，限制 endMonth >= startMonth
      if (this.formData.startYear != null && year === this.formData.startYear) {
        const minMonth = this.formData.startMonth || 1;
        this.endMonthOptions = this.monthOptions.filter((m) => Number(m.value) >= Number(minMonth));

        if (typeof this.formData.endMonth === 'number' && this.formData.endMonth < minMonth) {
          this.formData.endMonth = null;
          this.formData.endDay = null;
          this.endDayOptions = [];
        }

        // 若同年同月，確保 endDay >= startDay
        if (
          this.formData.endMonth === this.formData.startMonth &&
          this.formData.startDay != null &&
          this.formData.endDay != null &&
          this.formData.endDay < this.formData.startDay
        ) {
          this.formData.endDay = null;
        }
      } else {
        this.endMonthOptions = this.monthOptions.slice();
      }
    }

    // 通知外部表單變更
    this.formChange.emit(this.formData);
  }

  // 選擇事件
  onSelectionChange(field: keyof typeof this.formData, option: Option) {
    (this.formData as any)[field] = option.value;

    // 當 startDay 改變時，更新 endDayOptions 並同時考慮兩年上界
    if (field === 'startDay') {
      const startDay = Number(option.value);
      const MAX_END_YEARS = 2;

      const startYear = this.formData.startYear != null ? Number(this.formData.startYear) : null;
      const startMonth = this.formData.startMonth != null ? Number(this.formData.startMonth) : null;
      const maxYear = startYear != null ? startYear + MAX_END_YEARS : null;

      if (this.formData.endYear != null && this.formData.endMonth != null) {
        const endYear = Number(this.formData.endYear);
        const endMonth = Number(this.formData.endMonth);

        // 同年同月：endDay 下限為 startDay
        if (startYear != null && endYear === startYear && startMonth != null && endMonth === startMonth) {
          const allDays = this.generateDayOptions(endYear, endMonth);
          this.endDayOptions = allDays.filter((d) => Number(d.value) >= startDay);
          if (typeof this.formData.endDay === 'number' && this.formData.endDay < startDay) {
            this.formData.endDay = null;
          }

        // 若 end 在上界年且為上界同月（例如 start 2022/04/15 -> max 2024/04/15）：endDay 上限為 startDay
        } else if (startYear != null && startMonth != null && maxYear != null && endYear === maxYear && endMonth === startMonth) {
          const maxDay = startDay; // 上界同日
          const allDays = this.generateDayOptions(endYear, endMonth);
          this.endDayOptions = allDays.filter((d) => Number(d.value) <= maxDay);
          if (typeof this.formData.endDay === 'number' && this.formData.endDay > maxDay) {
            this.formData.endDay = null;
          }

        } else {
          // 其他情況（不同年或不同月且不在上界同月），允許該月所有日
          this.endDayOptions = this.generateDayOptions(this.formData.endYear, this.formData.endMonth);
        }
      } else {
        this.endDayOptions = [];
      }
    }

    this.formChange.emit(this.formData);
  }

  // 當切換按鈕時更新 formData
  onScopeChange(tab: TabType) {
    this.formData.flightType = tab;
    this.getAirlineList();
  }

  // 確認按鈕
  onConfirm() {
    this.submit.emit(this.formData);
  }
}
