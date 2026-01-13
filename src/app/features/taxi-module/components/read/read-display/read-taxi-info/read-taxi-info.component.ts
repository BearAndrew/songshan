import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaxiService } from '../../../../service/taxi.service';
import { TaxiInfo } from '../../../../../../models/taxi.model';

@Component({
  selector: 'app-read-taxi-info',
  imports: [CommonModule],
  templateUrl: './read-taxi-info.component.html',
  styleUrl: './read-taxi-info.component.scss',
})
export class ReadTaxiInfoComponent {
  items = [
    {
      id: 1,
      carNo: '1234',
      code: '0001',
      name: '王小明',
      phone: '0900123456',
    },
    {
      id: 2,
      carNo: '5678',
      code: '0002',
      name: '李小華',
      phone: '0911222333',
    },
    {
      id: 3,
      carNo: '9012',
      code: '0003',
      name: '陳美麗',
      phone: '0922333444',
    },
    {
      id: 4,
      carNo: '3456',
      code: '0004',
      name: '林志強',
      phone: '0933444555',
    },
    {
      id: 5,
      carNo: '7890',
      code: '0005',
      name: '張雅婷',
      phone: '0944555666',
    },
  ];

  hasSearch: boolean = false;
  taxiInfoList!: TaxiInfo[];

  constructor(private taxiService: TaxiService) {
    this.taxiService.searchTaxi$.subscribe((res) => {
      this.hasSearch = true;
      this.taxiInfoList = res.taxiInfoList;
    });
  }
}
