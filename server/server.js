const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = 3000;
const apiRoute = require("./routes/apiRoute");
const authRoute = require("./routes/authRoute");
const socketController = require("./controllers/socketController");
const http = require("http");
const socketIO = require("socket.io");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:8080" }));

app.use("/", express.static(path.resolve(__dirname, "../build")));

// connects server and tells socket.io it's okay to accept these things from port 3000 to resolve cors issues that come out with using socket.io.
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

app.use("/api", apiRoute);
app.use("/auth", authRoute);
// app.use("/data", socketRoutes(io));

// app.use(cookieParser());
// const oneDay = 1000 * 60 * 60 * 24;
// app.use(
//   sessions({
//     secret: process.env.SECRET,
//     saveUninitialized: true,
//     cookie: { maxAge: oneDay },
//     resave: false,
//   })
// );

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}... kubersee app`);
// });

// looks for an event with "connection" and when you listen, you need a callback function. for future ref when someone connects to the server.
io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);
  let metricsInterval;
  socket.on("metrics", async (data) => {
    try {
      if (metricsInterval) {
        clearInterval(metricsInterval);
      }
      // Send metrics data to the client every 1000ms after the middleware has been set up
      metricsInterval = setInterval(async () => {
        const metrics = await socketController.getMetricsMiddleware(data);

        socket.emit("metrics", {
          topPods: metrics.topPods,
          topNodes: metrics.topNodes,
        });
      }, 1000);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      // Emit an error event or handle it in the event handler if needed
      socket.emit("error", "Error fetching metrics");
    }
  });

  socket.on("stats", async () => {
    try {
      setInterval(async () => {
        const stats = await socketController.getStatsMiddleware();

        socket.emit("stats", {
          namespaces: stats.namespaces,
          totalNamespaces: stats.namespaces.length,
          totalPods: stats.totalPods,
          totalNodes: stats.totalNodes,
        });
      }, 1000);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Emit an error event or handle it in the event handler if needed
      socket.emit("error", "Error fetching stats");
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  }); // listens for when a user disconnects from the server.
  app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../index.html"), function (err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Socket Server Running...");
});
