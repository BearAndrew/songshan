export const fakeData = {
queryData: {
    stat: [
      {
        label: 'CI',

        AllNumOfFlight: 1200,
        AllNumOfPax: 180000,

        IrregularFlight: 180,
        IrregularPax: 25000,

        IrregularRate: 15,          // 180 / 1200
        IrregularPaxRate: 13.9      // 25000 / 180000
      },
      {
        label: 'Peer Avg',

        AllNumOfFlight: 980,
        AllNumOfPax: 150000,

        IrregularFlight: 120,
        IrregularPax: 18000,

        IrregularRate: 12.24,
        IrregularPaxRate: 12
      }
    ],

    totalFlight: 1200,

    IrregularRate: 15,
    OnTimeRate: 85,

    IrregularPaxRate: 13.9,

    IrregularFlightRate0: 7.5,
    IrregularFlightRate30: 5.2,
    IrregularFlightRate60: 2.3,

    IrregularPaxRate0: 6.1,
    IrregularPaxRate30: 4.8,
    IrregularPaxRate60: 3.0
  }
};
