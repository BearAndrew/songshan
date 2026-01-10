import { Component } from '@angular/core';
import { TaxiService } from '../../../../service/taxi.service';
import { TaxiViolation } from '../../../../../../models/taxi.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-read-black-list',
  imports: [CommonModule],
  templateUrl: './read-black-list.component.html',
  styleUrl: './read-black-list.component.scss',
})
export class ReadBlackListComponent {
  blackList: TaxiViolation[] = [];

  constructor(private taxiService: TaxiService) {
    this.taxiService.blackListSubject$.subscribe((res) => (this.blackList = res));
  }
}
