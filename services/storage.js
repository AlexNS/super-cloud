import { StorageItem } from '../db/connection.js';
import { Sequelize } from 'sequelize';
import path from 'path';

function makePath(path, name) {
    return `${path}${name}/`;
}

export async function getFolderById(folderId, userId) {
    return folderId ? await StorageItem.findOne({
            where: {
                id: folderId,
                UserId: userId
            }
        })
        : await StorageItem.findOne({
            where: {
                name: '',
                path: '',
                UserId: userId
            }
        });
}

export async function getFolderItems(folder) {
    return await StorageItem.findAll({
        where: {
            path: makePath(folder.path, folder.name),
            UserId: folder.UserId
        },
        order: [
            ['type', 'ASC'],
            ['name', 'ASC']
        ]
    });
}

export async function getFileById(fileId, userId) {
    return await StorageItem.findOne({
        where: {
            id: fileId,
            type: 2,
            UserId: userId
        }
    });
}

export async function createFolder(newFolderName, rootFolder) {
    return await StorageItem.create({
        name: newFolderName,
        type: 1,
        path: makePath(rootFolder.path, rootFolder.name),
        extension: '',
        UserId: rootFolder.UserId
    });
}

export async function createFile(rootFolder, originalName, mimeType, 
    fileSize, filePath) {
    return await StorageItem.create({
        name: originalName,
        type: 2,
        mimeType: mimeType,
        path: makePath(rootFolder.path, rootFolder.name),
        extension: path.extname(originalName),
        size: fileSize,
        storagePath: filePath,
        UserId: rootFolder.UserId
    });
}

export async function getFolderBreadcrumbs(folder) {

    const folderPath = makePath(folder.path, folder.name);

    const parts = folderPath.split('/');

    const result = [];

    while(parts.length >= 1) {
        result.push(parts.join('/'));
        parts.pop();
    }

    const items = await StorageItem.findAll({
        where: {
             [Sequelize.Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('CONCAT', Sequelize.col('path'), Sequelize.col('name')), 
                        { [Sequelize.Op.in]: result },
                    ),
                    { UserId: folder.UserId },
                    { type: 1 },
                ]
        },
        order: [
            ['type', 'ASC'],
            [Sequelize.fn('length', Sequelize.col('path')), 'ASC']
        ]
    });

    return items.map(x => ({
            path: x.path, 
            name: x.name, 
            id: x.id
        }));
}