import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Cria um servidor Express
const app = express();

//Middleware 
app.use(express.json());

import AuthController from './controllers/AuthController';
import SituationsController from './controllers/SituationsController';

app.use("/", AuthController);
app.use("/", SituationsController);

app.listen(process.env.PORT, () => {
  console.log(`Servidor com sucesso iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});