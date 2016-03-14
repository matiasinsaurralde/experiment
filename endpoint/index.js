var express = require( 'express' ),
    app = express()

const endpointName = process.env.ENDPOINT || 'unknown',
      delayFactor = process.env.DELAY_FACTOR || 3000

function delay(callback) {
  var delayTime = Math.random() * delayFactor
  console.log('delayTime', delayTime )
  setTimeout( callback, delayTime )
}

app.get( '/', function( req, res ) {
  var message = { data: ['hello from endpoint '+endpointName] }
  delay( function() {
    res.json( message )
  })
})

app.listen( process.env.PORT, function() {
  console.info( 'Running' )
})
