// const express = require("express");
// const router = express.Router();

// // Middleware function to log Socket.io events and data
// function logSocketEvent(socket, next) {
//   console.log(`Event: ${socket.event}`);
//   console.log("Data:", socket.data);
//   next(); // Call next() to proceed to the next middleware or the event handler
// }

// // Route to handle Socket.io connection event
// router.io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   // Use the middleware for a specific event
//   socket.use(logSocketEvent);

//   setInterval(() => {
//     socket.emit("logs", {
//       pod: "prometheus-kube-state-metrics-799f44d4db-wvm2t",
//       cpuCurrentUsage: "0.001241719",
//       memoryCurrentUsage: "12636160",
//       timestamp: 1688849973965,
//     });
//   }, 1000);
//   // Handle custom Socket.io events here
//   //   socket.on('logs', (data) => {
//   //     console.log(`Received message: ${data}`);
//   //     // Broadcast the message to all connected clients except the sender
//   //     socket.broadcast.emit('logs', data);
//   //   });

//   // Handle disconnection event
//   socket.on("disconnect", () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

// Middleware function to log Socket.io events and data
function logSocketEvent(socket, next) {
  console.log(`Event: ${socket.event}`);
  console.log("Data:", socket.data);
  next(); // Call next() to proceed to the next middleware or the event handler
}

// Export a function that sets up Socket.io events
function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Use the middleware for a specific event
    socket.use(logSocketEvent);

    setInterval(() => {
      socket.emit("logs", {
        pod: "prometheus-kube-state-metrics-799f44d4db-wvm2t",
        cpuCurrentUsage: "0.001241719",
        memoryCurrentUsage: "12636160",
        timestamp: 1688849973965,
      });
    }, 1000);

    // Handle disconnection event
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return router;
}

module.exports = setupSocket;
