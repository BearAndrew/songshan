import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../service/taxi.service';
import { TaxiInfo } from '../../../../../models/taxi.model';
import { TaxiDuplicateComponent } from "../../common/taxi-duplicate/taxi-duplicate.component";

@Component({
  selector: 'app-update-display',
  imports: [CommonModule, TaxiDuplicateComponent],
  templateUrl: './update-display.component.html',
  styleUrl: './update-display.component.scss',
})
export class UpdateDisplayComponent {
  hasSearch: boolean = false;
  searchRegPlate: string = '';
  taxiInfoList!: TaxiInfo[];
  afterTaxiInfo!: TaxiInfo;

  constructor(private taxiService: TaxiService) {
    this.taxiService.searchTaxi$.subscribe((res) => {
      this.hasSearch = true;
      this.searchRegPlate = res.searchRegPlate;
      this.taxiInfoList = res.taxiInfoList;
      console.log(res)
    });

    this.taxiService.update$.subscribe((res) => {
      this.afterTaxiInfo = res;
    });
  }

  getViolationLabel(status: string | null): string {
    if (status == null) return '';

    const map = [
      { key: 'BLACKLIST', label: '黑名單' },
      { key: 'GREYLIST', label: '灰名單' },
    ];

    return map.find((m) => status.includes(m.key))?.label ?? '無違規';
  }
}
