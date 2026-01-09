import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-read-display',
  imports: [CommonModule],
  templateUrl: './read-display.component.html',
  styleUrl: './read-display.component.scss',
})
export class ReadDisplayComponent {
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

  grayList = [
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
}
