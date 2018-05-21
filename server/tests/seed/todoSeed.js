    const {
        ObjectID
    } = require('./../../db/mongo');
    const {
        Todo
    } = require('../../models/Todo');
    const todos = [{
            _id: new ObjectID(),
            text: 'Test Todo text'
        },
        {
            _id: new ObjectID(),
            text: 'todo dummy 2',
            completed: true,
            completedAt: 1212121
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

