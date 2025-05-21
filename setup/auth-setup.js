import {User} from '../db/connection.js';
import LocalStrategy from 'passport-local';
import passport from 'passport';

export default function authSetup(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({
            where: {
                email: username
            }
        }).then((u) => {
          if (u?.password != password) {
            return done(null, false);
          }
    
          return done(null, u);
        })
      }
    ));
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findOne({
            where:{ 
                id
            }
        }).then((user) => {
            done(null, {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user.id
            });
        });
    });

    app.post('/login', 
      passport.authenticate('local', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });
}