package main

import(	"fmt"
	"sync"
	"io/ioutil"
	"net/http" )

var Endpoints = []string{
  "http://127.0.0.1:2000/",
  "http://127.0.0.1:2001/",
  "http://127.0.0.1:2002/",
  "http://127.0.0.1:2003/",
}

func handler(w http.ResponseWriter, r *http.Request) {
  flusher, _ := w.(http.Flusher)

  notify := w.(http.CloseNotifier).CloseNotify()

  go func() {
    <-notify
    fmt.Println( "Client connection closed" )
  }()

  w.Header().Set("Content-Type", "text/plain; charset=utf-8")
  w.WriteHeader(http.StatusOK)

  var requestGroup sync.WaitGroup

  requestGroup.Add( len( Endpoints ) )

  for _, endpoint := range Endpoints {
    fmt.Println( "Sending endpoint request " + endpoint )
    go func( endpoint string, w http.ResponseWriter ) {
      defer requestGroup.Done()
      resp, _ := http.Get( endpoint )
      body, _ := ioutil.ReadAll( resp.Body )
      resp.Body.Close()

      fmt.Println( "Receiving & pushing endpoint response " + string(body) )

      w.Write( body )
      w.Write( []byte("\n" ) )
      flusher.Flush()
      // endpointChan <- body
    }(endpoint, w )
  }


  requestGroup.Wait()

}

func main() {
    fmt.Println( "Gateway up" )
    http.HandleFunc("/", handler)
    http.ListenAndServe(":5001", nil)
}
