const fs = require('fs')

const meters = fs.readFileSync('parkingmeters2015.csv', 'utf8')

const meterArray = meters.split('\r\n').map(meter => {
  singleArray = meter.split(',')
  return singleMeter = {
    x: singleArray[0],
    y: singleArray[1],
    id: singleArray[2],
    street: singleArray[3],
    notFound: singleArray[4],
    lat: singleArray[6],
    lng: singleArray[5]
  }
})

fs.writeFile('meterData.js', 'const meters = ' + JSON.stringify(meterArray), () => { })