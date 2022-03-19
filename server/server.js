const http = require("http");
const WebSocketServer = require("websocket").server
let connection = null;
connections = [];
messages = [];

//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpserver = http.createServer((req, res) =>
    console.log("we have received a request"))

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res 
const websocket = new WebSocketServer({
    "httpServer": httpserver
})


httpserver.listen(8080, () => console.log("My server is listening on port 8080"))

const requestListener = function (req, res) {
    res.setHeader("Content-type", "application/json")
    res.writeHead(200);
    res.end(JSON.stringify({
        users: [{ id: 1, username: 's.sorbello', name: 'Sergio', surname: 'Sorbello' },
        { id: 2, username: 'a.dellachiave', name: 'Nina', surname: 'Della Chiave' },
        { id: 3, username: 'g.bellan', name: 'Giulia', surname: 'Bellan' }]
    }))
}
const server = http.createServer(requestListener);
server.listen(8080, 'localhost', () => {
    console.log('server is running on http://localhost:8080');
})

//when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it! 
websocket.on("request", request => {

    connection = request.accept(null, request.origin);
    // messages.forEach(message => connection.send(message));
    connections.push(connection);
    connection.on("open", () => console.log("Opened!!!"))
    connection.on("close", (conn) => console.log("CLOSED!!!", conn))
    connection.on("message", message => {
        message = `${message.utf8Data}`;
        messages.push(message);
        connections.forEach(element => {
            element.send(message);
        });
        console.log(`Received message ${message}`)
        // connection.send(`got your message: ${message.utf8Data}`)
    })


    //use connection.send to send stuff to the client 
    // sendevery5seconds();


})

function sendevery5seconds() {

    connection.send(`Message ${Math.random()}`);

    setTimeout(sendevery5seconds, 5000);


}


//client code 
//let ws = new WebSocket("ws://localhost:8080");
//ws.onmessage = message => console.log(`Received: ${message.data}`);
//ws.send("Hello! I'm client")