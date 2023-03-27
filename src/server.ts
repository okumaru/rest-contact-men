import dotenv from 'dotenv';
import app from './app'

dotenv.config();

// define http port
const port = process.env.REST_PORT ?? 8000; 

// starting the server
app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));