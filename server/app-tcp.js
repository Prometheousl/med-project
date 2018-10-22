const express = require("express");
const http = require("http");
const colors = require("colors");
const axios = require("axios");

const port = process.env.PORT || 4002;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
//const server = http.createServer();

var healthData = "";

server.on("connection", function(socket) {
  var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
  console.log("new client connection is made %s".green, remoteAddress);

  socket.on("data", function(d) {
    console.log("Data from %s: %s".cyan, remoteAddress, d);
    healthData = d;
  });

  socket.once("close", function () {
    console.log("Connection from %s closed".yellow, remoteAddress);
  });

  socket.on("error", function(err) {
    console.log("Connection %s error: %s".red, remoteAddress, err.message);
  });
});

server.listen(port, function() {
  console.log("server listening to %j", server.address());
});

app.get("/api", function(request, response) {
  console.log("Received request for /api");
  console.log("Healthdata is %s.", healthData);

  response.writeHead(200, {"Content-Type": "application/json"});
  response.write(JSON.stringify(healthData));
});
