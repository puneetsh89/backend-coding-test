const response = [
  {
    created: '20200429 02:35:59',
    driverName: 'john',
    driverVehicle: 'car',
    endLat: 10,
    endLong: 115,
    rideId: 1,
    riderName: 'jeff',
    startLat: 15,
    startLong: 115,
  },
  {
    created: '20200429 02:35:59',
    driverName: 'jog',
    driverVehicle: 'truck',
    endLat: 80,
    endLong: 160,
    rideId: 2,
    riderName: 'jin',
    startLat: -85,
    startLong: 80,
  },
  {
    created: '20200429 02:35:59',
    driverName: 'ron',
    driverVehicle: 'car',
    endLat: 70,
    endLong: 60,
    rideId: 3,
    riderName: 'obama',
    startLat: 85,
    startLong: 80,
  },
  {
    created: '20200429 02:35:59',
    driverName: 'tyson',
    driverVehicle: 'truck',
    endLat: -70,
    endLong: -60,
    rideId: 4,
    riderName: 'mike',
    startLat: 65,
    startLong: 80,
  },
];
const insertData = {
  driverName: 'jog',
  driverVehicle: 'truck',
  endLat: 80,
  endLong: 160,
  riderName: 'jin',
  startLat: -85,
  startLong: 80,
};
const insertResult = {
  driverName: 'jog',
  driverVehicle: 'truck',
  endLat: 80,
  endLong: 160,
  riderName: 'jin',
  startLat: -85,
  startLong: 80,
  rideId: 5,
};
module.exports = {
  response,
  insertData,
  insertResult,
};