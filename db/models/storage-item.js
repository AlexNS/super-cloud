import { DataTypes } from 'sequelize';

export default function defineStorageItem(sequelize, User) {
  const model = sequelize.define(
    'StorageItem',
    {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      extension: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 1 - folder
      // 2 - file
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // /x/x1/x2/x3/x
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      storagePath: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      // Other model options go here
    },
  );

  User.hasMany(model);
  model.belongsTo(User);

  return model;
};