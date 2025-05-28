import multer from 'multer';
import path from 'path';
import config from '../config.js';
import fs from 'fs/promises';

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    if (!req.user?.id) {
        return cb('No user!');
    }

    const storePath = path.join(config.storagePath, req.user.id.toString());

    try {
        await fs.stat(storePath);
    } catch {
        await fs.mkdir(storePath);
    }

    cb(null, storePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

export default upload;