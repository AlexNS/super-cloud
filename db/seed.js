import sequelize, { StorageItem, User } from './connection.js';

export default async function seed() {
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    let adminUser = await User.findOne({
        where: {
            email: 'admin'
        }
    });

    if (!adminUser) {
        adminUser = await User.create({
           firstName: 'Admin',
           email: 'admin',
           password: 'admin' 
        })
    }

    const root = await StorageItem.findOne({
        where: {
            UserId: adminUser.id,
            path: '',
            name: '',
            type: 1 // folder
        }
    })

    if (!root) {
        await StorageItem.create({
            UserId: adminUser.id,
            path: '',
            type: 1,
            name: '',
            extension: ''
        });
    }
}