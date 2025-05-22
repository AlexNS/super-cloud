import express from 'express';
import bodyParser from 'body-parser';
import seed from './db/seed.js';

import authSetup from './setup/auth-setup.js';
import sessionSetup from './setup/session-setup.js';
import nunjucks from 'nunjucks';
import auth from './middleware/auth.js';

import filesRoutes from './routes/files-routes.js';
import recentRoutes from './routes/recent-routes.js';

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.set('view engine', 'njk');

app.use('/', express.static('static'));

app.use(bodyParser.urlencoded({ extended: true }));

sessionSetup(app);
authSetup(app);


app.get('/', auth, (req, res) => {
    res.redirect('/files');
})

app.get('/login', (req, res) => {
    res.render('login.njk');
})

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
})

app.use('/files', auth, filesRoutes);
app.use('/recent', auth, recentRoutes);

seed().then(() => {
    app.listen(3000, () => {
        console.log('Server started!')
    })
})
