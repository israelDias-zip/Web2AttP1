import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../data-source';

const router = express.Router();

AppDataSource.initialize().then(()=>{
  console.log("Conexão do banco de dados realizada com sucesso!");
}).catch((error)=>{
  console.log("Erro na conexão com o banco de dados!");
})

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World! Welcome thats the login page");
});

export default router;