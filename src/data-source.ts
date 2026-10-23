import "reflect-metadata"
import { DataSource } from "typeorm"
import { Situation } from "./entity/Situations";
import { User } from "./entity/Users";
import { ProductSituation } from "./entity/ProductSituations";
import { ProductCategory } from "./entity/ProductCategories";
import { Product } from "./entity/Products";

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
    entities: [Situation, User, ProductSituation, ProductCategory, Product],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
})

