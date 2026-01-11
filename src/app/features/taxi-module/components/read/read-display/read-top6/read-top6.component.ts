import { Component } from '@angular/core';
import { TaxiService } from '../../../../service/taxi.service';
import { TaxiStatusInfo } from '../../../../../../models/taxi.model';

@Component({
  selector: 'app-read-top6',
  imports: [],
  templateUrl: './read-top6.component.html',
  styleUrl: './read-top6.component.scss',
})
export class ReadTop6Component {
  top6List: TaxiStatusInfo[] = [];

  constructor(private taxiService: TaxiService) {
    this.taxiService.top6Subject$.subscribe((res) => {
      this.top6List = res;
    });
  }
}
