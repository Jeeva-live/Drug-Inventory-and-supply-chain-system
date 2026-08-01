require("dotenv").config();
const http = require('http');
const app = require("./src/app");
const connectDB = require("./src/config/db");
const socketService = require("./src/services/socket.service");
const aiPipeline = require("./src/services/ai.pipeline");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

connectDB().then(() => {
  socketService.init(server);
  aiPipeline.startPipeline(); // Start the AI Loop
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
