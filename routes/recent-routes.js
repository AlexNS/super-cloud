import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('recent');
})

export default router;