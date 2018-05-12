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
var port = process.env.PORT || 3000;

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    var todos = Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findById(id).then((todo) => {
        if (!todo)
            return res.status(404).send();
        res.status(200).send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

app.listen(port, () => {
    console.log(`Started server on port ${port}`);

});
module.exports = {
    app
};