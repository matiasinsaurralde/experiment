var express = require( 'express' ),
    request = require( 'request' ),
    async = require( 'async' ),
    colors = require( 'colors' ),
    app = express()

const endpoints = [
  'http://127.0.0.1:2000/',
  'http://127.0.0.1:2001/',
  'http://127.0.0.1:2002/',
  'http://127.0.0.1:2003/'
]

app.get( '/', function( req, res ) {
  req.socket.setTimeout( 99999 )

  var messageCount = 0

  async.each( endpoints, function( endpoint, callback ) {
    console.log( 'Sending endpoint request', endpoint )
    request( endpoint, function( err, endpointResponse, body ) {
      console.log( 'Receiving & pushing endpoint response', body )
      res.write( body + "\n" )
      messageCount++
      callback()
    })
  }, function() {
    res.end()
  })

  res.writeHead( 200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  // res.write( '\n' )
})

app.listen( 5000, function() {
  console.log( 'Gateway up' )
})
