module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://Mezax:hfbUs7jK6tW0Pm05@cluster0.n6aw3f3.mongodb.net/postop',
  jwtSecret: process.env.JWT_SECRET || 'MezaxGalalovic',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  bcryptRounds: 12,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dvcsoqnjl',
    apiKey: process.env.CLOUDINARY_API_KEY || '682685848131469',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'TMVoV5GnKjVW3miLKOENtuN9phk',
  },
  redis: { url: process.env.REDIS_URL || 'rediss://default:gQAAAAAAAVKyAAIgcDEwZjcyYWI0NGYyYWU0N2I5OTQwZmU5YjViY2IzMzJkMA@infinite-cricket-86706.upstash.io:6379' },
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:5000',
  corsOrigins: ['http://localhost:5173', 'http://localhost:3000'],
};