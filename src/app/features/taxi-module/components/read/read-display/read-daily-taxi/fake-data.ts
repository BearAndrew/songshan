export const MOCKDATA = {
  eventData: [
    {
      regPlate: 'ABC-1234',
      driverName: '王小明',
      inTime: '2026-01-27T08:10:00',
      outTime: '2026-01-27T12:30:00',
      image: 'https://picsum.photos/200/120?1'
    },
    {
      regPlate: 'DEF-5678',
      driverName: '李小華',
      inTime: '2026-01-27T09:00:00',
      outTime: '2026-01-27T18:00:00',
      image: 'https://picsum.photos/200/120?2'
    },
    {
      regPlate: 'GHI-9999',
      driverName: '陳大雄',
      inTime: '2026-01-27T07:30:00',
      outTime: '2026-01-27T11:45:00',
      image: 'https://picsum.photos/200/120?3'
    }
  ],
  violationData: [
    {
      rid: 1,
      regPlate: 'ABC-1234',
      dateFrom: '2026-01-01T00:00:00',
      dateTo: '2026-02-01T00:00:00',
      violationType: 'BLACKLIST',
      reason: '重大違規',
      driver_no: 'D001',
      driver_name: '王小明'
    },
    {
      rid: 2,
      regPlate: 'DEF-5678',
      dateFrom: '2026-01-15T00:00:00',
      dateTo: '2026-01-31T00:00:00',
      violationType: 'GREYLIST',
      reason: '輕微違規',
      driver_no: 'D002',
      driver_name: '李小華'
    }
  ]
};
