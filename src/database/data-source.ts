import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "vitrine-medicamentos",
  synchronize: true,
  logging: true,
  entities: ["src/entities/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
});
