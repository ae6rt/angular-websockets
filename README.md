### End to end Websocket demo based on embedded Jetty 9

Clone and start the server:

./gradlew clean run

Then point your browser to http://localhost:8080/index.html, and see the date updated in the view every 5 seconds.
The update date arrives from the server over a websocket.

