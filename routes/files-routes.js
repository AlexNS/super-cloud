import { Router } from 'express';
import { StorageItem } from '../db/connection.js';

const router = Router();

router.get('/', async (req, res) => {
    const folderId = parseInt(req.query.folderId);

    const user = req.user;
    const root = folderId ? await StorageItem.findOne({
            where: {
                id: folderId,
                UserId: user.id
            }
        })
        : await StorageItem.findOne({
            where: {
                name: '/',
                UserId: user.id
            }
        });
    
    

    const items = await StorageItem.findAll({
        where: {
            path: root.path + root.name,
            UserId: user.id
        }
    });

    const model = {
        currentFolder: root,
        folderItems: items
    }

    res.render('files', model);
})

export default router;