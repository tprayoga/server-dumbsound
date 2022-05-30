const express = require("express");
require("dotenv").config();
const router = require("./src/routes");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // cors digunakan agar client bisa melakukan CRUD
    origin: process.env.CLIENT_URL,// define client origin if both client and server have different origin
  },
});

require("./src/socket")(io);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/", router)
app.use("/uploads", express.static("uploads"));


server.listen(port, () => console.log(`Listening on port ${port}`));
