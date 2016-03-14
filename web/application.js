window.onload = function() {
  var es = new EventSource( 'http://127.0.0.1:5000/' )
  console.log( 'es' )
  es.onmessage = function (event) {
    console.log('message', event, event.data )
  }

}
