import "reflect-metadata"
import { DataSource } from "typeorm"
import { Situation } from "./entity/Situations";
import { User } from "./entity/Users";

import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT ?? "mysql";

// Configurações do banco de dados
export const AppDataSource = new DataSource({
    type: dialect as "mysql" | "postgres" | "mariadb" | "mongodb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situation, User],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
})

// Inicializa a conexão com o banco de dados
AppDataSource.initialize().then(()=>{
  console.log("Conexão do banco de dados realizada com sucesso!");
}).catch((error)=>{
  console.log("Erro na conexão com o banco de dados!");
})