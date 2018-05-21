const {
    ObjectID
} = require('./../../db/mongo');
const {
    User
} = require('../../models/User');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
        _id: userOneId,
        email: 'arup.shibai@gmail.com',
        password: 'userOnePassword',
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: userOneId,
                access: 'auth'
            }, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'test@example.com',
        password: 'userTwoPassord',
    }
];
const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}
module.exports = {
    users,
    populateUsers
};