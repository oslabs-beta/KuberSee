const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;
const apiRoute = require('./routes/apiRoute');
const authRoute = require('./routes/authRoute');
const http = require('http');
const { Server } = require('socket.io');
// const cookieParser = require("cookie-parser");
// const sessions = require("express-session");

// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// const oneDay = 1000 * 60 * 60 * 24;
// app.use(
//   sessions({
//     secret: process.env.SECRET,
//     saveUninitialized: true,
//     cookie: { maxAge: oneDay },
//     resave: false,
//   })
// );

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(function(req, res, next) {
    req.io = io;
    next();
});

io.on('connection', function(socket) {
    //log.info('socket.io connection made');
    console.log('socket.io connection made');
});

app.use('/', express.static(path.resolve(__dirname, '../build')));
app.use('/api', apiRoute);
app.use('/auth', authRoute);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}... idea generator app`);
});

module.exports = { io };
