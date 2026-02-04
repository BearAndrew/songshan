import { BaggageTimeItem } from "../../../../models/baggage-time.model";

export const mock: BaggageTimeItem[] = [
  {
    flightNo: 'BR123',
    departurePort: 'TPE',
    sta: '10:00',
    eta: '10:05',
    ata: '10:10',
    ibt: '10:15',

    // 行李（First）
    firstBagDeplane: '10:20',
    firstBagArriveCarousel: '10:25',
    firstBagOnCarousel: '10:30',
    firstBagInXray: '10:35',
    firstBagOutXray: '10:40',

    // 行李（Last）
    lastBagDeplane: '10:45',
    lastBagArriveCarousel: '10:50',
    lastBagOnCarousel: '10:55',
    lastBagInXray: '11:00',
    lastBagOutXray: '11:05',

    // 旅客（First）
    paxFirstGate: '10:18',
    paxFirstImmigration: '10:28',
    paxFirstCarousel: '10:38',
    paxFirstArrCustom: '10:48',
    paxFirstExitCustom: '10:58',
    paxFirstTaxi: '11:08',

    // 旅客（Last）
    paxLastGate: '10:35',
    paxLastImmigration: '10:45',
    paxLastCarousel: '10:55',
    paxLastArrCustom: '11:05',
    paxLastExitCustom: '11:15',
    paxLastTaxi: '11:25',
  },
];
