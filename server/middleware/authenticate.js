const {
    User
} = require('../models/User');
const authenticate = (req, res, next) => {
    let token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user)
            return Promise.reject();
        res.send(user);
        next();
    }).catch((e) => {
        res.status(401).send(e);
    });
};
module.exports = {
    authenticate
};