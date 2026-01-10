import { Component } from '@angular/core';

@Component({
  selector: 'app-read-black-list',
  imports: [],
  templateUrl: './read-black-list.component.html',
  styleUrl: './read-black-list.component.scss'
})
export class ReadBlackListComponent {

  blackList = [
    {
      id: 1,
      carNo: 'ABC-1234',
      name: '王大明',
      code: '0001',
      reason: '違規停車',
      suspension: '2026/01/01 - 2026/01/31',
      status: '停權中',
    },
    {
      id: 2,
      carNo: 'XYZ-5678',
      name: '李小華',
      code: '0002',
      reason: '超速',
      suspension: '2026/01/05 - 2026/02/05',
      status: '停權中',
    },
    {
      id: 3,
      carNo: 'DEF-9012',
      name: '張三',
      code: '0003',
      reason: '酒駕',
      suspension: '2025/12/20 - 2026/01/20',
      status: '停權中',
    },
    {
      id: 4,
      carNo: 'GHI-3456',
      name: '陳小美',
      code: '0004',
      reason: '違規超載',
      suspension: '2026/01/10 - 2026/02/10',
      status: '停權中',
    },
    {
      id: 5,
      carNo: 'JKL-7890',
      name: '林大同',
      code: '0005',
      reason: '違規改裝',
      suspension: '2026/01/15 - 2026/02/15',
      status: '停權中',
    },
    {
      id: 6,
      carNo: 'MNO-1122',
      name: '黃小青',
      code: '0006',
      reason: '逃逸肇事',
      suspension: '2026/01/18 - 2026/02/18',
      status: '停權中',
    },
  ];
}
