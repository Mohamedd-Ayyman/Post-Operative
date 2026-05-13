const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/prediction');
const analyticsRoutes = require('./routes/analytics');
const winston = require('winston');
const helmet = require('helmet');
const cors = require('cors');
const { createClient } = require('redis');
const { Server } = require('socket.io');

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ format: winston.format.simple() })],
});

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Swagger
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
try {
  const spec = yaml.load('./docs/openapi.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
} catch { /* swagger optional */ }

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

let io;
async function start() {
  await mongoose.connect(config.mongoUri);
  logger.info('Connected to MongoDB');

  const redisClient = createClient({ url: config.redis.url });
  redisClient.on('error', () => {}).connect().catch(() => {});

  io = new Server(app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  }), {
    cors: { origin: config.corsOrigins, credentials: true },
    path: '/socket.io',
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, config.jwtSecret);
        socket.join(`user:${decoded.id}`);
      } catch { /* invalid */ }
    }
  });
}

module.exports = { app, start };