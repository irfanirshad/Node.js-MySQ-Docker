import express from 'express';
import ip from 'ip';
import cors from 'cors';
import dotenv from 'dotenv';
import Response from './domain/response.js';
import HttpStatus from './controller/patient.controller.js';
import logger from './util/logger.js';
import patientRoutes from './route/patient.route.js';

const hs = HttpStatus;

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000 ; 
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/patients', patientRoutes); 
app.get('/', (req,res) => {
    res.send(new Response(hs.OK.code, hs.OK.status, 'Patient API, v1.0.0 - All Systems Go'));
}); 
app.all('*', (req,res) => {
    res.status(hs.NOT_FOUND.code)
    .send(new Response(hs.NOT_FOUND.code, hs.NOT_FOUND.status, 'Route does not exist. Please try again'));
}); 

console.log(process.env);
app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));
