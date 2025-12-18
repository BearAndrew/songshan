import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlightRow } from '../../core/interface/daily-domestic-standby-analysis.interface';

@Component({
  selector: 'app-daily-domestic-standby-analysis',
  imports: [CommonModule],
  templateUrl: './daily-domestic-standby-analysis.component.html',
  styleUrl: './daily-domestic-standby-analysis.component.scss',
})
export class DailyDomesticStandbyAnalysisComponent {
  tableData: FlightRow[] = [
    {
      route: '金門',
      weather: {
        temperature: '23°C',
        description: '晴時多雲',
        visibility: '10公里以上',
        altitude: '3800呎',
        windSpeed: '17浬/時',
      },
      details: [
        {
          airline: '立榮航空',
          waitlist: 5,
          onsite: 20,
          nextFlights: 3,
          flown: 150,
          filled: 10,
        },
        {
          airline: '華信航空',
          waitlist: 3,
          onsite: 15,
          nextFlights: 2,
          flown: 120,
          filled: 8,
        },
        {
          airline: '立榮航空',
          waitlist: 6,
          onsite: 18,
          nextFlights: 1,
          flown: 90,
          filled: 5,
        },
      ],
    },
    {
      route: '澎湖',
      weather: {
        temperature: '23°C',
        description: '晴時多雲',
        visibility: '10公里以上+',
        altitude: '3800呎',
        windSpeed: '17浬/時',
      },
      details: [
        {
          airline: '立榮航空',
          waitlist: 4,
          onsite: 22,
          nextFlights: 2,
          flown: 140,
          filled: 9,
        },
        {
          airline: '華信航空',
          waitlist: 2,
          onsite: 12,
          nextFlights: 1,
          flown: 100,
          filled: 6,
        },
        {
          airline: '立榮航空',
          waitlist: 7,
          onsite: 25,
          nextFlights: 3,
          flown: 180,
          filled: 12,
        },
      ],
    },
     {
      route: '澎湖',
      weather: {
        temperature: '23°C',
        description: '晴時多雲',
        visibility: '10公里以上+',
        altitude: '3800呎',
        windSpeed: '17浬/時',
      },
      details: [
        {
          airline: '立榮航空',
          waitlist: 4,
          onsite: 22,
          nextFlights: 2,
          flown: 140,
          filled: 9,
        },
        {
          airline: '華信航空',
          waitlist: 2,
          onsite: 12,
          nextFlights: 1,
          flown: 100,
          filled: 6,
        },
        {
          airline: '立榮航空',
          waitlist: 7,
          onsite: 25,
          nextFlights: 3,
          flown: 180,
          filled: 12,
        },
      ],
    },
     {
      route: '澎湖',
      weather: {
        temperature: '23°C',
        description: '晴時多雲',
        visibility: '10公里以上+',
        altitude: '3800呎',
        windSpeed: '17浬/時',
      },
      details: [
        {
          airline: '立榮航空',
          waitlist: 4,
          onsite: 22,
          nextFlights: 2,
          flown: 140,
          filled: 9,
        },
        {
          airline: '華信航空',
          waitlist: 2,
          onsite: 12,
          nextFlights: 1,
          flown: 100,
          filled: 6,
        },
        {
          airline: '立榮航空',
          waitlist: 7,
          onsite: 25,
          nextFlights: 3,
          flown: 180,
          filled: 12,
        },
      ],
    },
     {
      route: '澎湖',
      weather: {
        temperature: '23°C',
        description: '晴時多雲',
        visibility: '10公里以上+',
        altitude: '3800呎',
        windSpeed: '17浬/時',
      },
      details: [
        {
          airline: '立榮航空',
          waitlist: 4,
          onsite: 22,
          nextFlights: 2,
          flown: 140,
          filled: 9,
        },
        {
          airline: '華信航空',
          waitlist: 2,
          onsite: 12,
          nextFlights: 1,
          flown: 100,
          filled: 6,
        },
        {
          airline: '立榮航空',
          waitlist: 7,
          onsite: 25,
          nextFlights: 3,
          flown: 180,
          filled: 12,
        },
      ],
    },
     {
      route: '澎湖',
      weather: {
        temperature: '23°C',
        description: '晴時多雲',
        visibility: '10公里以上+',
        altitude: '3800呎',
        windSpeed: '17浬/時',
      },
      details: [
        {
          airline: '立榮航空',
          waitlist: 4,
          onsite: 22,
          nextFlights: 2,
          flown: 140,
          filled: 9,
        },
        {
          airline: '華信航空',
          waitlist: 2,
          onsite: 12,
          nextFlights: 1,
          flown: 100,
          filled: 6,
        },
        {
          airline: '立榮航空',
          waitlist: 7,
          onsite: 25,
          nextFlights: 3,
          flown: 180,
          filled: 12,
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.tableData.forEach((group) => {
      group.maxWaitlist = Math.max(...group.details.map((d) => d.waitlist));
      group.maxNextFlights = Math.max(
        ...group.details.map((d) => d.nextFlights)
      );
      group.maxFlown = Math.max(...group.details.map((d) => d.flown));
      group.maxFilled = Math.max(...group.details.map((d) => d.filled));
    });
  }
}
