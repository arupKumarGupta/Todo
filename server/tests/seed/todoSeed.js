    const {
        ObjectID
    } = require('./../../db/mongo');
    const {
        Todo
    } = require('../../models/Todo');
    const {
        users,
    } = require('./userSeed');
    const todos = [{
            _id: new ObjectID(),
            text: 'Test Todo text',
            _creator: users[0]._id
        },
        {
            _id: new ObjectID(),
            text: 'todo dummy 2',
            completed: true,
            completedAt: 1212121,
            _creator: users[1]._id
        }
    ];
    const populateTodos = (done) => {
        Todo.remove({}).then(() => {
            return Todo.insertMany(todos);
        }).then(() => done());
    }
    module.exports = {
        todos,
        populateTodos
    };