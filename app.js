require('dotenv').config();
require('express-async-errors');
// extra security packages
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')

const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const jobRoute = require('./routes/jobs');
const authRoutes = require('./routes/auth');
const connectDB = require('./db/connect');
const authenticationMiddleWare = require('./middleware/authentication');

app.use(express.json());

app.use(rateLimiter(
  {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
))
app.use(helmet())
app.use(cors())
app.use(xss())


app.get('/', (req, res) => {
  res.send('Jobs API')
})

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/jobs', authenticationMiddleWare, jobRoute);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
