import { Sequelize } from 'sequelize';
import config from '../config.js';
import defineUser from './models/user.js';

const sequelize = new Sequelize(config.dbDatabaseName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect:'postgres'
});

export const User = defineUser(sequelize);

export default sequelize;
