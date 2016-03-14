package main

import(	"fmt"
	"io/ioutil"
	"net/http" )

var Endpoints = []string{
  "http://127.0.0.1:2000/",
  "http://127.0.0.1:2001/",
  "http://127.0.0.1:2002/",
  "http://127.0.0.1:2003/",
}

func handler(w http.ResponseWriter, r *http.Request) {
  fmt.Println( "handler" )

  flusher, ok := w.(http.Flusher)

  if !ok {
    fmt.Println( "can't initialize flusher")
    return
  }

  endpointChan := make(chan []byte)

  for _, endpoint := range Endpoints {
    go func( endpoint string ) {
      fmt.Println( "Sending req to endpoint " + endpoint )
      resp, _ := http.Get( endpoint )
      body, _ := ioutil.ReadAll( resp.Body )
      resp.Body.Close()
      fmt.Println( body )
      endpointChan <- body
    }(endpoint)
  }

  notify := w.(http.CloseNotifier).CloseNotify()

  go func() {
    <-notify
    fmt.Println( "closed" )
  }()

  w.Header().Set("Content-Type", "text/plain; charset=utf-8")
  w.WriteHeader(http.StatusOK)


  for {
    fmt.Println( "write?" )
    w.Write( <-endpointChan )
    w.Write( []byte("\n") )

    flusher.Flush()
  }

}

func main() {
    fmt.Println( "init" )
    http.HandleFunc("/", handler)
    http.ListenAndServe(":5000", nil)
}
