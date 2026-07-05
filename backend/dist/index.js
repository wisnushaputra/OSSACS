import { createServer } from './server';
import { config } from './config';
const server = createServer();
const start = async () => {
    try {
        await server.listen({ port: config.port, host: '0.0.0.0' });
        console.log(`Server listening on port ${config.port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
