import { Server } from "http";
import app from "./app";
import { handleSocketConnection } from "./app/sockets/socket.handlers";
import config from "./config";
import { initializeSocketIO } from "./config/socket.config";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("Server is running on port", config.port);
  });

  // Initialize Socket.IO
  const io = initializeSocketIO(server);

  // Handle Socket.IO connections
  io.on("connection", handleSocketConnection);
}

main();
