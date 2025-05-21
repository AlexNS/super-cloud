import { Sequelize } from 'sequelize';

import defineUser from './models/user.js';

const sequelize = new Sequelize('sc', 'postgres', 'postgres', {
  host: 'localhost',
  dialect:'postgres'
});

export const User = defineUser(sequelize);

export default sequelize;
