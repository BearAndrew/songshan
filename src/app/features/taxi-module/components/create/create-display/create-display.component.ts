import { TaxiInfo } from '../../../../../models/taxi.model';
import { TaxiService } from './../../../service/taxi.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-display',
  imports: [],
  templateUrl: './create-display.component.html',
  styleUrl: './create-display.component.scss'
})
export class CreateDisplayComponent {

  data!: TaxiInfo;

  constructor(private taxiService: TaxiService) {
    this.taxiService.createTaxi$.subscribe(res => {
      this.data = res;
    })
  }

}
