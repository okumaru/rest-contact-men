import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

import contactRouter from './routes/contact';
import tagRouter from './routes/tag';

dotenv.config();

// define http port
const port = process.env.NODE_ENV ?? 8000; 

const app: Express = express(); // defining the Express app
app.use(helmet()); // adding Helmet to enhance your Rest API's security
app.use(express.json()); // using express to parse JSON bodies into JS objects
app.use(cors()); // enabling CORS for all requests

require("./utils/db"); // mongodb connection

// define routes
app.get('/', (req: Request, res: Response) => res.send('Express + TypeScript Server'));
app.use('/contact', contactRouter)
app.use('/tag', tagRouter)

// starting the server
app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));