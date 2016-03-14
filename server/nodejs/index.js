var express = require( 'express' ),
    request = require( 'request' ),
    async = require( 'async' ),
    app = express()

const endpoints = [
  'http://127.0.0.1:2000/',
  'http://127.0.0.1:2001/',
  'http://127.0.0.1:2002/',
  'http://127.0.0.1:2003/'
]

app.use( function( req, res, next ) {
  res.header( 'Access-Control-Allow-Origin', '*' )
  // res.header( 'Access-Control-Allow-Headers', 'X-Requested-With' )
  next()
})

app.get( '/', function( req, res ) {
  req.socket.setTimeout( 99999 )

  var messageCount = 0

  async.each( endpoints, function( endpoint, callback ) {
    console.log( 'sending endpoint request', endpoint )
    request( endpoint, function( err, endpointResponse, body ) {
      console.log( 'receiving endpoint response', body )
      res.write( 'id: ' + messageCount + '\n' )
      res.write( 'data: ' + body + '\n\n' )
      messageCount++
      callback()
    })
  }, function() {
  })

  res.writeHead( 200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  res.write( '\n' )
})

app.listen( 5000 )
