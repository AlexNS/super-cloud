export default function auth(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect('/login');
    }
}