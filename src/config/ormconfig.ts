import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { DataSource } from "typeorm";

const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'devuser',
    password: '1234',
    database: 'blog',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // load all entities in the project
    synchronize: true, // dont use in production!
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/../migrations/**/*.ts'],
};

const AppDataSource = new DataSource(config)

export { AppDataSource };

export default config;