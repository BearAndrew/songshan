import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../service/taxi.service';
import { TaxiInfo } from '../../../../../models/taxi.model';

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
  taxiInfoList!: TaxiInfo[];

  constructor(private taxiService: TaxiService) {
    this.taxiService.searchTaxi$.subscribe((res) => {
      this.hasSearch = true;
      this.searchRegPlate = res.searchRegPlate;
      this.taxiInfoList = res.taxiInfoList;
    });

    this.taxiService.deleteSubject$.subscribe(() => this.deleteSuccess = true);
  }
}
