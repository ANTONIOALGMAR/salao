require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Validação básica de variáveis de ambiente essenciais
const requiredEnvs = ['MONGO_URI', 'JWT_SECRET'];
const missing = requiredEnvs.filter((k) => !process.env[k] || process.env[k].trim() === '');
if (missing.length) {
  // Não derruba em test para não quebrar CI local
  if (process.env.NODE_ENV !== 'test') {
    // Comentário em português: variáveis obrigatórias não definidas
    // eslint-disable-next-line no-console
    console.error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// Conexão com o banco
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Oculta header x-powered-by
app.disable('x-powered-by');

// Segurança de headers
app.use(helmet());

// Limites de tamanho de body
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(cookieParser());

// Sanitização contra NoSQL injection (sem tocar em req.query no Express 5)
const stripNoSqlOperators = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      return; // ignora chaves perigosas
    }
    const value = obj[key];
    clean[key] = typeof value === 'object' ? stripNoSqlOperators(value) : value;
  });
  return clean;
};

app.use((req, _res, next) => {
  if (req.body) req.body = stripNoSqlOperators(req.body);
  if (req.params) req.params = stripNoSqlOperators(req.params);
  // não altera req.query para evitar erro em Express 5
  next();
});
app.use(hpp());

// CORS restrito por ORIGEM via env; permissivo se não definido (para não quebrar em dev)
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',') : true,
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting (global leve e específico para login)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // limite amplo para não quebrar
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Aplicar limiter no endpoint de login antes de montar rotas
app.use('/api/users/login', loginLimiter);

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/loyalty', require('./routes/loyaltyRoutes'));

// Error Handling Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;