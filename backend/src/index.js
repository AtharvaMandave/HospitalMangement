import { app } from "./app.js";
import dotenv from 'dotenv'
import dbConnect from "./db/index.js";
import { createServer } from 'http';
import { initializeSocket } from './socket.js';

dotenv.config({
    path: '../.env'
})

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

dbConnect()
    .then(() => {
        httpServer.listen(process.env.PORT, () => {
            console.log("✅ Server is running at port ", process.env.PORT);
            console.log("🔌 WebSocket server is ready");
        })
    })
    .catch((err) => {
        console.log("❌ Db2 connection failed !!! ", err);
    })