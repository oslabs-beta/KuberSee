const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;
const apiRoute = require('./routes/apiRoute');
const authRoute = require('./routes/authRoute');
const http = require('http');
const { Server } = require('socket.io'); // importing a class called Server from the socket.io library 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// const cookieParser = require("cookie-parser");
// const sessions = require("express-session");

// app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
  }
}) // connects server and tells socket.io it's okay to accept these things from port 3000 to resolve cors issues that come out with using socket.io.
// const oneDay = 1000 * 60 * 60 * 24;
// app.use(
//   sessions({
//     secret: process.env.SECRET,
//     saveUninitialized: true,
//     cookie: { maxAge: oneDay },
//     resave: false,
//   })
// );

app.use('/', express.static(path.resolve(__dirname, '../build')));
app.use('/api', apiRoute);
app.use('/auth', authRoute);

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}... kubersee app`);
// });

let data;
// looks for an event with "connection" and when you listen, you need a callback function. for future ref when someone connects to the server. 
io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);
  if (data) clearInterval(data);
  setInterval(() => socket.emit('hello',))
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  }) // listens for when a user disconnects from the server. 
})
server.listen(3001, () => {
  console.log('Socket Server Running...')
})

// module.exports = { io };
