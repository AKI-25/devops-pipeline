import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import bootstrap from './src/main.server';
import express  from 'express';
import { Pool } from 'pg'
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import {Server} from 'socket.io';
// For method-override
import methodOverride from 'method-override';
import { createServer } from 'http';
// For async
import async from 'async';


// The Express app is exported so that it can be used by serverless Functions.
export function app(): any {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const httpServer = createServer(server); // Create an HTTP server
  const io = new Server(httpServer); // Attach Socket.io to the HTTP server
  console.log(io)
  io.on('connection', (socket: any) => {
    console.log('A user connected to the socket');

    // Send a welcome message when a client connects
    // socket.emit('connection', 'Welcome to the server socket!');

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected from the socket');
    });
  });


  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));


  
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'votes',
    password: 'postgres',
    port: 5432,
  });
  
  async.retry(
    {times: 1000, interval: 1000},
    function(callback:any) {
      pool.connect(function(err:any, client:any, done:any) {
        if (err) {
          console.error("Waiting for db");
        }
        callback(err, client);
      });
    },
    function(err:any, client:any) {
      if (err) {
        return console.error("Giving up");
      }
      getVotes(client);
    }
  );
  function getVotes(client:any) {
    client.query('SELECT * FROM vote_count;', [], function(err:any, result:any) {
      if (err) {
        console.error("Error performing query: " + err);
      } else {
        const message = `{ "art1" : ${result.rows[0].art1}, "art2" : ${result.rows[0].art2}}`;


        // Emit the message to all connected clients
        io.emit('voteUpdate', message);
      }
  
      setTimeout(function() {getVotes(client) }, 1000);
    });
  }


  server.use(methodOverride('X-HTTP-Method-Override'));
  server.use(function(req:any, res:any, next:any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
  });
  // All regular routes use the Angular engine
  server.get('*', (req:any, res:any, next:any) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return httpServer;
}




function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
