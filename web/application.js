$(document).ready( function() {
  function poll() {
    $.ajax({ url: 'server', success: function(data) {
      console.log( 'data?', data )
    }, dataType: "json", complete: poll, timeout: 1000 })
  }
  poll()
})
