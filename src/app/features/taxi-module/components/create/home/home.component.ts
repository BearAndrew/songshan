import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api-service.service';
import { CurrentTaxi } from '../../../../../models/taxi.model';

@Component({
  selector: 'app-create-home',
  imports: [],
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
        regPlate: taxi.regPlate || '\u00A0',
        driverName: taxi.driverName || '\u00A0',
        violation: taxi.violation || '\u00A0',
        inTime: taxi.inTime || '\u00A0',
        location: taxi.location || '\u00A0',
        image: taxi.image || '\u00A0',
      }));
    });
  }
}
