require('dotenv').config();
require('express-async-errors');
// extra security packages
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')

const rateLimiter = require('express-rate-limit')

// Swagger

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')



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
  res.send('<h1>Jobs AsPI</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/jobs', authenticationMiddleWare, jobRoute);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, '0.0.0.0', () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
