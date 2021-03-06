require('./config/config');
const {
    authenticate
} = require('./middleware/authenticate');
const _ = require('lodash');
const {
    mongoose,
    ObjectID
} = require('./db/mongo');
const {
    Todo
} = require('./models/Todo');
const {
    User
} = require('./models/User');
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var port = process.env.PORT;
/* ------------------------------------------------------------------------------------------- */
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    var todos = Todo.find({
        _creator: new ObjectID(req.user._id)
    }).then((todos) => {
        res.send({
            todos
        });
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo)
            return res.status(404).send();
        res.status(200).send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });

});
/* Deletes todo by id */
app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo)
            return res.status(404).send();
        res.status(200).send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
        $set: body,

    }, {
        new: true,
        runValidators: true
    }).then((todo) => {
        if (!todo)
            return res.status(404).send();
        res.status(200).send({
            todo
        });
    }).catch((e) => {
        return res.status(400).send();
    });

});

/* ---------------------------------------------------------------------------------------------- */
/* USERS */
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => res.status(400).send(e));
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByEmail(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.delete('/users/me/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => res.status(200).send(), () => res.status(400).send());
});

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});
module.exports = {
    app
};