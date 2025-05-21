import express from 'express';
import bodyParser from 'body-parser';
import seed from './db/seed.js';

import authSetup from './setup/auth-setup.js';
import sessionSetup from './setup/session-setup.js';

import auth from './middleware/auth.js';

const app = express();

app.set('view engine', 'ejs');

app.use('/', express.static('static'));

app.use(bodyParser.urlencoded({ extended: true }));

sessionSetup(app);
authSetup(app);


app.get('/', auth, (req, res) => {
    res.render('main');
})

app.get('/login', (req, res) => {
    res.render('login');
})


seed().then(() => {
    app.listen(3000, () => {
        console.log('Server started!')
    })
})
