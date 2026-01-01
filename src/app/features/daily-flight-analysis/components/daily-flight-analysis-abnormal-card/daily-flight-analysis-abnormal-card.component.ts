import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';
import { DailyFlightAnalysisAbnormalData } from '../../../../core/interface/daily-flight-analysis.interface';

@Component({
  selector: 'app-daily-flight-analysis-abnormal-card',
  imports: [CommonModule],
  templateUrl: './daily-flight-analysis-abnormal-card.component.html',
  styleUrl: './daily-flight-analysis-abnormal-card.component.scss',
})
export class DailyFlightAnalysisAbnormalCardComponent extends DailyFlightAnalysisChildComponent {
  toggleIndex: number = 0;
  @Input() inData!: DailyFlightAnalysisAbnormalData;
  @Input() outData!: DailyFlightAnalysisAbnormalData;
  @Input() allData!: DailyFlightAnalysisAbnormalData;

  displayData!: DailyFlightAnalysisAbnormalData;

  ngOnInit(): void {
    this.displayData = this.outData;
    // this.displayData = {
    //   info: [
    //     {
    //       flightNumber: 'CI101',
    //       destination: 'Tokyo',
    //       scheduledTime: '2025-03-01 08:30',
    //       affectedPeople: 180,
    //       status: 'Delayed',
    //     },
    //     {
    //       flightNumber: 'BR217',
    //       destination: 'Osaka',
    //       scheduledTime: '2025-03-01 09:15',
    //       affectedPeople: 220,
    //       status: 'Cancelled',
    //     },
    //     {
    //       flightNumber: 'JL809',
    //       destination: 'Fukuoka',
    //       scheduledTime: '2025-03-01 10:00',
    //       affectedPeople: 150,
    //       status: 'Delayed',
    //     },
    //     {
    //       flightNumber: 'CX451',
    //       destination: 'Hong Kong',
    //       scheduledTime: '2025-03-01 11:20',
    //       affectedPeople: 200,
    //       status: 'Delayed',
    //     },
    //     {
    //       flightNumber: 'KE692',
    //       destination: 'Seoul',
    //       scheduledTime: '2025-03-01 12:45',
    //       affectedPeople: 175,
    //       status: 'Cancelled',
    //     },
    //     {
    //       flightNumber: 'SQ879',
    //       destination: 'Singapore',
    //       scheduledTime: '2025-03-01 14:10',
    //       affectedPeople: 260,
    //       status: 'Delayed',
    //     },
    //     {
    //       flightNumber: 'NH853',
    //       destination: 'Nagoya',
    //       scheduledTime: '2025-03-01 15:30',
    //       affectedPeople: 140,
    //       status: 'Delayed',
    //     },
    //     {
    //       flightNumber: 'TG635',
    //       destination: 'Bangkok',
    //       scheduledTime: '2025-03-01 16:50',
    //       affectedPeople: 300,
    //       status: 'Cancelled',
    //     },
    //   ],

    //   top3: [
    //     {
    //       city: 'Tokyo',
    //       airport: 'HND',
    //       forecast: {
    //         flightCount: 120,
    //         passengerCount: 18000,
    //       },
    //       actual: {
    //         flightCount: 98,
    //         passengerCount: 14500,
    //       },
    //     },
    //     {
    //       city: 'Osaka',
    //       airport: 'KIX',
    //       forecast: {
    //         flightCount: 95,
    //         passengerCount: 13200,
    //       },
    //       actual: {
    //         flightCount: 70,
    //         passengerCount: 9800,
    //       },
    //     },
    //     {
    //       city: 'Seoul',
    //       airport: 'ICN',
    //       forecast: {
    //         flightCount: 110,
    //         passengerCount: 16500,
    //       },
    //       actual: {
    //         flightCount: 90,
    //         passengerCount: 13800,
    //       },
    //     },
    //     {
    //       city: 'Hong Kong',
    //       airport: 'HKG',
    //       forecast: {
    //         flightCount: 105,
    //         passengerCount: 15000,
    //       },
    //       actual: {
    //         flightCount: 88,
    //         passengerCount: 12700,
    //       },
    //     },
    //     {
    //       city: 'Singapore',
    //       airport: 'SIN',
    //       forecast: {
    //         flightCount: 85,
    //         passengerCount: 14200,
    //       },
    //       actual: {
    //         flightCount: 72,
    //         passengerCount: 11800,
    //       },
    //     },
    //     {
    //       city: 'Bangkok',
    //       airport: 'BKK',
    //       forecast: {
    //         flightCount: 90,
    //         passengerCount: 16000,
    //       },
    //       actual: {
    //         flightCount: 68,
    //         passengerCount: 11200,
    //       },
    //     },
    //     {
    //       city: 'Nagoya',
    //       airport: 'NGO',
    //       forecast: {
    //         flightCount: 60,
    //         passengerCount: 9000,
    //       },
    //       actual: {
    //         flightCount: 48,
    //         passengerCount: 7100,
    //       },
    //     },
    //     {
    //       city: 'Shanghai',
    //       airport: 'PVG',
    //       forecast: {
    //         flightCount: 130,
    //         passengerCount: 20000,
    //       },
    //       actual: {
    //         flightCount: 102,
    //         passengerCount: 15800,
    //       },
    //     },
    //   ],
    // };
  }

  onIndexChange(index: number): void {
    this.toggleIndex = index;
    switch (index) {
      case 0:
        this.displayData = this.outData;
        break;
      case 1:
        this.displayData = this.inData;
        break;
      case 2:
        this.displayData = this.allData;
        break;
    }
  }
}
