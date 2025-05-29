import { Router } from 'express';
import upload from '../middleware/multer.js';
import fsize from '../helpers/filesize.js';

import * as storage from '../services/storage.js';

const router = Router();

router.get('/', async (req, res) => {
    const folderId = parseInt(req.query.folderId);

    const user = req.user;
    
    const root = await storage.getFolderById(folderId, user.id);
    const items = await storage.getFolderItems(root);
    const breadcrumbs = await storage.getFolderBreadcrumbs(root);

    const model = {
        currentFolder: root,
        folderItems: items,
        breadcrumbs,
        fsize
    }

    res.render('files', model);
})


router.get('/download', async (req, res) => {
    const fileId = parseInt(req.query.fileId);

    const user = req.user;
    
    const file = await storage.getFileById(fileId, user.id);

    if (!file) {
        return res.status(404);
    }

    res.download(file.storagePath, file.name);
})

router.post('/create-folder', async (req, res) => {
    const newFolderName = req.body.newFolderName;
    const parentFolderId = req.body.parentFolderId;

    const root = await storage.getFolderById(parentFolderId, req.user.id);

    await storage.createFodler(newFolderName, root);

    res.redirect(`/files?folderId=${parentFolderId}`);
})

router.post('/upload-file', upload.single('file'), async (req, res) => {
    const parentFolderId = req.body.parentFolderId;

    const root = await storage.getFolderById(parentFolderId, req.user.id);

    await storage.createFile(root, req.file.originalname, req.file.mimetype,
        req.file.size, req.file.path);

    res.redirect(`/files?folderId=${parentFolderId}`);
})

router.post('/delete-file', async (req, res) => {
    const fileId = parseInt(req.query.fileId);
    const folderId = parseInt(req.query.folderId);

    const user = req.user;
    
    await storage.deleteFileById(fileId, user.id);

    res.redirect(`/files?folderId=${folderId}`);
})

export default router;