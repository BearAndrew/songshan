import { RealTimeTrafficFlowItem } from "../../models/real-time-traffic-flow.model";

export const mockItems: RealTimeTrafficFlowItem[] = [
  {
    locationName: '登管口',
    data: [
      {
        label: '國內線',
        population: 18,
        waitTime: 6,
        image: [
          'https://picsum.photos/seed/gate-domestic-1/400/300',
          'https://picsum.photos/seed/gate-domestic-2/400/300'
        ]
      },
      {
        label: '國際線',
        population: 25,
        waitTime: 8,
        image: [
          'https://picsum.photos/seed/gate-international-1/400/300',
          'https://picsum.photos/seed/gate-international-2/400/300'
        ]
      }
    ]
  },
  {
    locationName: '行李托運',
    data: [
      {
        label: '華信航空',
        population: 20,
        waitTime: 5,
        image: [
          'https://picsum.photos/seed/baggage-mandarin-1/400/300',
          'https://picsum.photos/seed/baggage-mandarin-2/400/300'
        ]
      },
      {
        label: '立榮航空',
        population: 15,
        waitTime: 4,
        image: [
          'https://picsum.photos/seed/baggage-uni-1/400/300',
          'https://picsum.photos/seed/baggage-uni-2/400/300'
        ]
      }
    ]
  },
  {
    locationName: '2F 美食廣場',
    data: [
      {
        label: '用餐尖峰',
        population: 30,
        waitTime: 10,
        image: [
          'https://picsum.photos/seed/foodcourt-peak-1/400/300',
          'https://picsum.photos/seed/foodcourt-peak-2/400/300'
        ]
      },
      {
        label: '離峰時段',
        population: 12,
        waitTime: 3,
        image: [
          'https://picsum.photos/seed/foodcourt-offpeak-1/400/300',
          'https://picsum.photos/seed/foodcourt-offpeak-2/400/300'
        ]
      }
    ]
  }
];
