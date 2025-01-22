import { connectToPostgres } from './services/database.service'; 
import dotenv from 'dotenv'; 
import express from 'express'
import bodyParser from 'body-parser';
import { setupSwagger } from './swagger';
import { Express } from 'express';
import { apiRateLimiter } from './rateLImiter';
import routes from './routes'

dotenv.config();

const app: Express = express();


connectToPostgres()
  .then(() => {
    console.log("PostgreSQL connected!");


    setupSwagger(app);
    app.use(apiRateLimiter);
    app.use(express.json());
    app.use(bodyParser.json());

    app.use('/api', routes);

    app.listen(process.env.PORT, () => {
      console.log("Server is listening at the Port:", process.env.PORT || 8000);
      console.log("Server is at port: http://localhost:8000/ and swagger at: http://localhost:8000/api-docs");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to PostgreSQL:", error);
  });
