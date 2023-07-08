import fs from 'fs';
import path from 'path';
import https from 'https';

import app from './app';
import { initializeSocketIo } from './socket.io';

const PORT = '3000';

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'cert.pem')),
};

function startServer() {
  const server = https.createServer(httpsOptions, app);
  initializeSocketIo(server);
  server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
}

startServer();
