import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../service/taxi.service';
import { SearchTaxiInfo } from '../../../service/taxi.interface';

@Component({
  selector: 'app-update-display',
  imports: [CommonModule],
  templateUrl: './update-display.component.html',
  styleUrl: './update-display.component.scss',
})
export class UpdateDisplayComponent {
  hasSearch: boolean = false;
  searchRegPlate: string = '';
  taxiInfo!: SearchTaxiInfo;

  constructor(private taxiService: TaxiService) {
    this.taxiService.searchTaxi$.subscribe((res) => {
      this.hasSearch = true;
      this.searchRegPlate = res.searchRegPlate;
      this.taxiInfo = res.taxiInfoList[0];
    });
  }
}
