const socket = io()

function myMap() {
  var mapProp = {
    // center:new google.maps.LatLng(2112625.9794610441, 6059698.9833894819),
    fullscreenControl: true,
    center: new google.maps.LatLng(37.78409100, -122.23709600),
    zoom: 15,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  console.log("mapProp+++++++++++++++++++++", map);

  const sampleData = meter.result.records.map(record => record.lonlatconc.split(', ').map(string => JSON.parse(string)))

  const smallSetOfMeters = meters.slice(0)

  smallSetOfMeters.filter(meter => meter.notFound.length === 0).forEach(meterObject => {

    new google.maps.Marker({
      icon: meterObject.notFound.length === 0 ? 'meterIcon.png' : 'meterNotFoundIcon.png',
      position: {
        lat: +meterObject.lng,
        lng: +meterObject.lat
      },
      map: map,
      title: 'Hello World!'
    })
  })

  let otherNotMovingCenter = true
  let otherNotZooming = true

  let zoomFactor = (2 ** (17 - map.getZoom())) / 88

  function offset(centerObject) {
    centerObject.lat = centerObject.lat + (zoomFactor * 0.9) * gridPosition.y
    centerObject.lng = centerObject.lng - (zoomFactor * 2) * gridPosition.x

    return centerObject
  }

  map.addListener('center_changed', function () {
    if (otherNotMovingCenter) {
      socket.emit('center_changed', JSON.stringify(offset(map.getCenter().toJSON())))
      log('sending center_changed message to server')
    }
  })

  map.addListener('zoom_changed', function () {
    log('zoom:', map.getZoom())

    zoomFactor = (2 ** (17 - map.getZoom())) / 88

    if (otherNotZooming) {
      socket.emit('zoom_changed', map.getZoom())
      log('sending zoom_changed message to server')

      socket.emit('center_changed', JSON.stringify(offset(map.getCenter().toJSON())))
      log('sending center_changed message to server')
    }
  })

  socket.on('center_changed', function (centerData) {
    log('received center_changed from server', centerData)

    if (centerData.senderId !== socket.id) {
      otherNotMovingCenter = false

      map.setCenter({
        lat: centerData.lat - (zoomFactor * 0.9) * gridPosition.y,
        lng: centerData.lng + (zoomFactor * 2) * gridPosition.x
      })

      otherNotMovingCenter = true

      log('responding to move on other client')
    }
  })

  socket.on('zoom_changed', function (zoomData) {
    log('received zoom_changed from server', zoomData)

    if (zoomData.senderId !== socket.id) {
      otherNotZooming = false

      map.setZoom(zoomData.zoom)

      otherNotZooming = true

      log('responding to zoom on other client')
    }
  })

}
