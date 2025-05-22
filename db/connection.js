import { Sequelize } from 'sequelize';
import config from '../config.js';
import defineUser from './models/user.js';
import defineStorageItem from './models/storage-item.js';

const sequelize = new Sequelize(config.dbDatabaseName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect:'postgres'
});

export const User = defineUser(sequelize);
export const StorageItem = defineStorageItem(sequelize, User);

export default sequelize;
