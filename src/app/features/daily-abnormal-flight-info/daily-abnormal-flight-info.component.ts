import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownComponent } from "../../shared/components/dropdown/dropdown.component";

@Component({
  selector: 'app-daily-abnormal-flight-info',
  imports: [CommonModule, DropdownComponent],
  templateUrl: './daily-abnormal-flight-info.component.html',
  styleUrl: './daily-abnormal-flight-info.component.scss',
})
export class DailyAbnormalFlightInfoComponent {
  activeIndex: number = 0;
  data = [
    {
      label: '國際兩岸線',
    },
    {
      label: '國際線',
    },
    {
      label: '兩岸線',
    },
    {
      label: '國內線',
    },
    {
      label: '總數',
    },
  ];

  table = [
    {
      flightNumber: 'AE305',
      origin: '金門',
      gate: '3',
      scheduledArrival: '10:20',
      actualArrival: '10:45',
      delayTime: '10:45',
      issue: '雷雨',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'CI127',
      origin: '台中',
      gate: '8',
      scheduledArrival: '12:10',
      actualArrival: '12:10',
      delayTime: '10:45',
      issue: '前班延遲影響',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'BR852',
      origin: '高雄',
      gate: '2',
      scheduledArrival: '14:30',
      actualArrival: '15:05',
      delayTime: '10:45',
      issue: '無人機異常',
      plannedAction: '改降',
      actualAction: '改降',
    },
        {
      flightNumber: 'AE305',
      origin: '金門',
      gate: '3',
      scheduledArrival: '10:20',
      actualArrival: '10:45',
      delayTime: '10:45',
      issue: '雷雨',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'CI127',
      origin: '台中',
      gate: '8',
      scheduledArrival: '12:10',
      actualArrival: '12:10',
      delayTime: '10:45',
      issue: '前班延遲影響',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'BR852',
      origin: '高雄',
      gate: '2',
      scheduledArrival: '14:30',
      actualArrival: '15:05',
      delayTime: '10:45',
      issue: '無人機異常',
      plannedAction: '改降',
      actualAction: '改降',
    },
        {
      flightNumber: 'AE305',
      origin: '金門',
      gate: '3',
      scheduledArrival: '10:20',
      actualArrival: '10:45',
      delayTime: '10:45',
      issue: '雷雨',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'CI127',
      origin: '台中',
      gate: '8',
      scheduledArrival: '12:10',
      actualArrival: '12:10',
      delayTime: '10:45',
      issue: '前班延遲影響',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'BR852',
      origin: '高雄',
      gate: '2',
      scheduledArrival: '14:30',
      actualArrival: '15:05',
      delayTime: '10:45',
      issue: '無人機異常',
      plannedAction: '改降',
      actualAction: '改降',
    },
        {
      flightNumber: 'AE305',
      origin: '金門',
      gate: '3',
      scheduledArrival: '10:20',
      actualArrival: '10:45',
      delayTime: '10:45',
      issue: '雷雨',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'CI127',
      origin: '台中',
      gate: '8',
      scheduledArrival: '12:10',
      actualArrival: '12:10',
      delayTime: '10:45',
      issue: '前班延遲影響',
      plannedAction: '改降',
      actualAction: '改降',
    },
    {
      flightNumber: 'BR852',
      origin: '高雄',
      gate: '2',
      scheduledArrival: '14:30',
      actualArrival: '15:05',
      delayTime: '10:45',
      issue: '無人機異常',
      plannedAction: '改降',
      actualAction: '改降',
    },
  ];

  dropdownOptions = [
    {label: '全部', value: 0}
  ]
}
