import { Router } from 'express';
import { StorageItem } from '../db/connection.js';
import path from 'path';
import upload from '../middleware/multer.js';

const router = Router();

async function getRootFolder(folderId, userId) {
    return folderId ? await StorageItem.findOne({
            where: {
                id: folderId,
                UserId: userId
            }
        })
        : await StorageItem.findOne({
            where: {
                name: '/',
                UserId: userId
            }
        });
}

router.get('/', async (req, res) => {
    const folderId = parseInt(req.query.folderId);

    const user = req.user;
    const root = await getRootFolder(folderId, user.id);
   
    const items = await StorageItem.findAll({
        where: {
            path: path.join(root.path, root.name),
            UserId: user.id
        },
        order: [
            ['type', 'ASC'],
            ['name', 'ASC']
        ]
    });

    const model = {
        currentFolder: root,
        folderItems: items
    }

    res.render('files', model);
})


router.get('/download', async (req, res) => {
    const fileId = parseInt(req.query.fileId);

    const user = req.user;
    
    const file = await StorageItem.findOne({
            where: {
                id: fileId,
                type: 2,
                UserId: user.id
            }
        });

    if (!file) {
        return res.status(404);
    }

    res.download(file.storagePath, file.name);
})

router.post('/create-folder', async (req, res) => {
    const newFolderName = req.body.newFolderName;
    const parentFolderId = req.body.parentFolderId;

    const root = await getRootFolder(parentFolderId, req.user.id);

    console.log(root);

    await StorageItem.create({
        name: newFolderName,
        type: 1,
        path: path.join(root.path, root.name),
        extension: '',
        UserId: req.user.id
    });

    res.redirect(`/files?folderId=${parentFolderId}`);
})

router.post('/upload-file', upload.single('file'), async (req, res) => {
    const parentFolderId = req.body.parentFolderId;

    const root = await getRootFolder(parentFolderId, req.user.id);


    await StorageItem.create({
        name: req.file.originalname,
        type: 2,
        mimeType: req.file.mimetype,
        path: path.join(root.path, root.name),
        extension: path.extname(req.file.originalname),
        size: req.file.size,
        storagePath: req.file.path,
        UserId: req.user.id
    });

    res.redirect(`/files?folderId=${parentFolderId}`);
})

export default router;