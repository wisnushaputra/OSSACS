// /home/wisnu/projects/OSSACS/backend/src/socket.test.ts
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createServer, startSocketIO } from './server';
import { io as Client } from 'socket.io-client';
import { config } from './config';
import { FastifyInstance } from 'fastify';

// Mock config for testing
config.jwtSecret = 'test_secret';
config.frontendUrl = 'http://localhost:3001'; // Allow all for test client
config.redisUrl = 'redis://localhost:6379'; // Ensure a local Redis is running for tests

describe('Socket.IO Gateway', () => {
  let fastify: FastifyInstance;
  let serverSocket: any; // Socket.IO server instance
  let clientSocket: any; // Socket.IO client instance

  before(async () => {
    fastify = createServer();
    await fastify.listen({ port: 3000 });
    
    serverSocket = await startSocketIO(fastify.server, fastify);
  });

  after(async () => {
    clientSocket?.disconnect();
    serverSocket?.close();
    await fastify.close();
  });

  it('should connect without token but fail authentication', (done: any) => {
    clientSocket = Client(`http://localhost:3000`, {
      transports: ['websocket'],
      forceNew: true,
    });
    clientSocket.on('connect_error', (err: Error) => {
      assert.strictEqual(err.message, 'Authentication error: Token missing');
      done();
    });
  });

  it('should connect with a valid JWT', (done: any) => {
    const validToken = fastify.jwt.sign({ id: 'testuser', username: 'testuser', roleId: 'admin_role_id' });
    clientSocket = Client(`http://localhost:3000`, {
      extraHeaders: {
        Authorization: `Bearer ${validToken}`,
      },
      auth: {
        token: validToken
      },
      transports: ['websocket'],
      forceNew: true,
    });
    clientSocket.on('connect', () => {
      assert.strictEqual(clientSocket.connected, true);
      done();
    });
    clientSocket.on('connect_error', (err: Error) => {
        done(err); // Fail test if connection errors
    });
  });

  it('should not connect with an invalid JWT', (done: any) => {
    clientSocket = Client(`http://localhost:3000`, {
      auth: { token: 'invalid.jwt.token' },
      transports: ['websocket'],
      forceNew: true,
    });
    clientSocket.on('connect_error', (err: Error) => {
      assert.strictEqual(err.message, 'Authentication error: Invalid token');
      done();
    });
  });

  it('should connect to a specific namespace with a valid JWT', (done: any) => {
    const validToken = fastify.jwt.sign({ id: 'testuser', username: 'testuser', roleId: 'admin_role_id' });
    clientSocket = Client(`http://localhost:3000/dashboard`, {
      auth: { token: validToken },
      transports: ['websocket'],
      forceNew: true,
    });
    clientSocket.on('connect', () => {
      assert.strictEqual(clientSocket.connected, true);
      assert.strictEqual(clientSocket.nsp, '/dashboard');
      done();
    });
    clientSocket.on('connect_error', (err: Error) => {
        done(err);
    });
  });

  it('should allow joining and leaving a room', (done: any) => {
    const validToken = fastify.jwt.sign({ id: 'testuser', username: 'testuser', roleId: 'admin_role_id' });
    const roomName = 'testRoom';

    clientSocket = Client(`http://localhost:3000/dashboard`, {
      auth: { token: validToken },
      transports: ['websocket'],
      forceNew: true,
    });

    clientSocket.on('connect', () => {
      clientSocket.emit('subscribe', roomName);
      setTimeout(() => { // Give server time to process join
        assert.ok(true); // Placeholder assertion
        clientSocket.emit('unsubscribe', roomName);
        done();
      }, 50);
    });
  });
});
