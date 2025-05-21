const express = require('express');
const connectDB = require('./config/db');
const AppError = require('./utils/appError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// db connect
connectDB();

// middleware init
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 3001;

// dev mode
process.env.NODE_ENV = 'development';

app.get('/', (req, res) => {
  res.send('Hello World from Scope App Backend! API is running...');
});

// routy
app.use('/api/users', require('./routes/users'));

// 404
app.all('*', (req, res, next) => {
  next(new AppError(`Nie znaleziono trasy ${req.originalUrl} na tym serwerze!`, 404));
});

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 