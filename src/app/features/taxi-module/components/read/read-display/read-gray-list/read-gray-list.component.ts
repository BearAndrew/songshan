import { Component } from '@angular/core';
import { TaxiViolation } from '../../../../../../models/taxi.model';
import { TaxiService } from '../../../../service/taxi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-read-gray-list',
  imports: [CommonModule],
  templateUrl: './read-gray-list.component.html',
  styleUrl: './read-gray-list.component.scss',
})
export class ReadGrayListComponent {
  grayList: TaxiViolation[] = [];

  constructor(private taxiService: TaxiService) {
    this.taxiService.blackListSubject$.subscribe(
      (res) => (this.grayList = res)
    );
  }
}
