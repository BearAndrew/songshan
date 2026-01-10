import { Component } from '@angular/core';
import { TaxiService } from '../../../../service/taxi.service';

@Component({
  selector: 'app-read-top6',
  imports: [],
  templateUrl: './read-top6.component.html',
  styleUrl: './read-top6.component.scss',
})
export class ReadTop6Component {
  top6List = [
    { id: 1, rank: 1, carNo: 'ABC-1234', name: '王大明', attendance: 15 },
    { id: 2, rank: 2, carNo: 'XYZ-5678', name: '李小華', attendance: 13 },
    { id: 3, rank: 3, carNo: 'DEF-9012', name: '張三', attendance: 12 },
    { id: 4, rank: 4, carNo: 'GHI-3456', name: '陳小美', attendance: 11 },
    { id: 5, rank: 5, carNo: 'JKL-7890', name: '林大同', attendance: 10 },
    { id: 6, rank: 6, carNo: 'MNO-1122', name: '黃小青', attendance: 9 },
    { id: 7, rank: 7, carNo: 'PQR-3344', name: '趙四', attendance: 8 },
    { id: 8, rank: 8, carNo: 'STU-5566', name: '孫五', attendance: 7 },
  ];

  constructor(private taxiService: TaxiService) {
    this.taxiService.top6Subject$.subscribe((res) => {
      // this.top6List = res;
    });
  }
}
