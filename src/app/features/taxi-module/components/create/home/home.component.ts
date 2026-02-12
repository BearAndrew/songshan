import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api-service.service';
import { CurrentTaxi } from '../../../../../models/taxi.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class CreateHomeComponent implements OnInit {
  taxis: CurrentTaxi[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCurrentTaxi().subscribe((res: CurrentTaxi[]) => {
      // 最多只取前 16 筆
      this.taxis = res.slice(0, 16).map((taxi) => ({
        eventid: taxi.eventid || '\u00A0',
        regPlate: taxi.regPlate || '\u00A0',
        driverName: taxi.driverName || '\u00A0',
        violation: taxi.violation || '\u00A0',
        inTime: taxi.inTime || '\u00A0',
        location: taxi.location || '\u00A0',
        image: taxi.image || '\u00A0',
      }));

      // // 產生假資料（16 筆）
      // const mockRes = Array.from({ length: 16 }, (_, i) => ({
      //   eventid: i.toString(),
      //   regPlate: `ABC-${1000 + i}`,
      //   driverName: `司機${i + 1}`,
      //   violation:
      //     i % 5 === 0
      //       ? 'NOTREG'
      //       : i % 5 === 1
      //       ? 'BLACKLIST'
      //       : 'GREYLIST',
      //   inTime: `10:${String(i * 3).padStart(2, '0')}`,
      //   location:
      //     i % 3 === 0
      //       ? '第一航廈'
      //       : i % 3 === 1
      //       ? '第二航廈'
      //       : '計程車排班區',
      //   image: '',
      // }));

      // // 最多只取前 16 筆
      // this.taxis = mockRes.slice(0, 16).map((taxi) => ({
      //   eventid: taxi.eventid || '\u00A0',
      //   regPlate: taxi.regPlate || '\u00A0',
      //   driverName: taxi.driverName || '\u00A0',
      //   violation: taxi.violation || '\u00A0',
      //   inTime: taxi.inTime || '\u00A0',
      //   location: taxi.location || '\u00A0',
      //   image: taxi.image || '\u00A0',
      // }));
    });
  }
}
