var express = require( 'express' ),
    app = express()

const endpointName = process.env.ENDPOINT || 'unknown',
      delayFactor = process.env.DELAY_FACTOR || 3000

function delay(callback) {
  var delayTime = Math.random() * delayFactor
  setTimeout( function() {
    callback( delayTime )
  }, delayTime )
}

app.get( '/', function( req, res ) {
  console.log( 'Receiving request' )
  var message = { data: ['hello from endpoint '+endpointName] }
  delay( function(t) {
    console.log( 'Sending response, delay:', t )
    res.json( message )
  })
})

app.listen( process.env.PORT, function() {
  console.info( 'Running' )
})
