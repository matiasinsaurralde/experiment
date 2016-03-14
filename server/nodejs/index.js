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
  // req.socket.setTimeout( Infinity )

  var messageCount = 1

  setTimeout( function() {

    res.write('id: ' + messageCount + '\n')
    res.write("data: " + 'hello' + '\n\n')

  }, 2000 )

  res.writeHead( 200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  res.write( '\n' )
})

app.listen( 5000 )
