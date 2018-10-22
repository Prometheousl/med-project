const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getApiAndEmit(socket),
    10000
  );
  socket.on('data', function(data) {
    console.log("data received: %s", data);
    socket.write("Hello" + data);
  });
  socket.on('message', () => console.log("message received"));
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/85410d0604d71e081b6dd2e15cd7d2aa/43.7695,11.2558"
    );
    console.log(res.data.currently.temperature);
    socket.emit("FromAPI", res.data.currently.temperature);
  } catch (error) {
    console.error(`Error in server: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));
