import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchTaxiInfo } from '../../../service/taxi.interface';
import { TaxiService } from '../../../service/taxi.service';

@Component({
  selector: 'app-delete-display',
  imports: [CommonModule],
  templateUrl: './delete-display.component.html',
  styleUrl: './delete-display.component.scss'
})
export class DeleteDisplayComponent {
  hasSearch: boolean = false;
  deleteSuccess: boolean = false;
  searchRegPlate: string = '';
  taxiInfo!: SearchTaxiInfo;

  constructor(private taxiService: TaxiService) {
    this.taxiService.searchTaxi$.subscribe((res) => {
      this.hasSearch = true;
      this.searchRegPlate = res.searchRegPlate;
      this.taxiInfo = res.taxiInfoList[0];
    });

    this.taxiService.deleteSubject$.subscribe(() => this.deleteSuccess = true);
  }
}
