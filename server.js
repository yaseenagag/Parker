const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

let port = process.env.PORT || 8080


const logging = true

function log() {
  if (logging) {
    console.log.apply(this, arguments)
  }
}


server.listen(port, () => console.log(`listening on port ${port}`))

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
  log('client connected', socket.id)

  socket.on('center_changed', center => {
    log('received center_changed message from client', center)

    center = JSON.parse(center)

    centerChangeData = {
      lat: center.lat,
      lng: center.lng,
      senderId: socket.id
    }

    log('boradcasting center_changed to clients')
    io.emit('center_changed', centerChangeData)
  })

  socket.on('zoom_changed', zoom => {
    log('received zoom_changed message from client', zoom)

    zoomChangeData = {
      zoom: zoom,
      senderId: socket.id
    }

    log('boradcasting zoom_changed to clients')
    io.emit('zoom_changed', zoomChangeData)
  })

})