import sequelize, { User } from './connection.js';

export default async function seed() {
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    const adminUser = await User.findOne({
        where: {
            email: 'admin'
        }
    });

    if (!adminUser) {
        await User.create({
           firstName: 'Admin',
           email: 'admin',
           password: 'admin' 
        })
    }
}