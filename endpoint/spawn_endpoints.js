const spawn = require( 'child_process' ).spawn,
      colors = require( 'colors' )

const endpoints = [
  { PORT: 2000, ENDPOINT: 'endpoint-1', DELAY_FACTOR: 500 },
  { PORT: 2001, ENDPOINT: 'endpoint-2', DELAY_FACTOR: 1000 },
  { PORT: 2002, ENDPOINT: 'endpoint-3', DELAY_FACTOR: 2000 },
  { PORT: 2003, ENDPOINT: 'endpoint-4', DELAY_FACTOR: 3000 }
]

const servers = [
]

function spawnEndpoint( env ) {
  env.PATH = process.env.PATH
  spawn( 'node', [ './index.js'], { env: env } ).stdout.on( 'data', function( data ) {
    var tag = '@' + env.ENDPOINT
    console.log( tag.green, data.toString().trim() )
  })
}

function spawnServer() {
  spawn( 'node', [ '../server/nodejs/index.js' ], { env: process.env } ).stdout.on( 'data', function( data ) {
    var tag = '@nodejs-gateway'
    console.log( tag.red, data.toString().trim() )
  })
  spawn( 'go', [ 'run', '../server/golang/main-sync.go' ], { env: process.env } ).stdout.on( 'data', function( data ) {
    var tag = '@go-gateway'
    console.log( tag.yellow, data.toString().trim() )
  })
}

spawnServer()

for( i in endpoints ) {
  var endpoint = endpoints[ i ]
  spawnEndpoint( endpoint )
  console.log( '-- Spawning'.yellow, JSON.stringify( endpoint  ) )
}
