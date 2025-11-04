import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const ormconfig: DataSourceOptions = {
  type: 'mongodb',
  url: process.env.MONGO_URI,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
};

const dataSource = new DataSource(ormconfig);
export default dataSource;
