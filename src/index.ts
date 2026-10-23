import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
dotenv.config();

// Cria um servidor Express
const app = express();

//Middleware 
app.use(express.json());

import AuthController from './controllers/AuthController';
import SituationsController from './controllers/SituationsController';
import UsersController from './controllers/UsersController';
import ProductSituationsController from './controllers/ProductSituationsController';
import ProductCategoriesController from './controllers/ProductCategoriesController';
import ProductsController from './controllers/ProductsController';

app.use("/", AuthController);
app.use("/", SituationsController);
app.use("/", UsersController);
app.use("/", ProductSituationsController);
app.use("/", ProductCategoriesController);
app.use("/", ProductsController);

// Inicializa a conexão com o banco de dados e depois inicia o servidor
AppDataSource.initialize().then(()=>{
  console.log("Conexão do banco de dados realizada com sucesso!");

  app.listen(process.env.PORT, () => {
    console.log(`Servidor com sucesso iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
  });
}).catch((error)=>{
  console.log("Erro na conexão com o banco de dados!");
});