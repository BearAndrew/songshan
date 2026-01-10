import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../service/taxi.service';
import { ReadTaxiInfoComponent } from "./read-taxi-info/read-taxi-info.component";
import { ReadBlackListComponent } from "./read-black-list/read-black-list.component";
import { ReadGrayListComponent } from "./read-gray-list/read-gray-list.component";
import { ReadTop6Component } from "./read-top6/read-top6.component";

@Component({
  selector: 'app-read-display',
  imports: [CommonModule, ReadTaxiInfoComponent, ReadBlackListComponent, ReadGrayListComponent, ReadTop6Component],
  templateUrl: './read-display.component.html',
  styleUrl: './read-display.component.scss',
})
export class ReadDisplayComponent {

  readType: string = '0'

  constructor(private taxiService: TaxiService) {
    this.taxiService.readType$.subscribe(res => this.readType = res);
  }
}
