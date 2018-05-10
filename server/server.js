const {mongoose} = require('./db/mongo');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 3000;

app.post('/todos',(req,res)=>{
    var todo = new Todo({text:req.body.text});
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos',(req,res)=>{
    var todos = Todo.find().then((todos)=>{
        res.send({todos});
    },(error)=>{
        res.status(400).send(error);
    });
});

app.listen(port,()=>{
    console.log(`Started server on port ${port}`);
    
});
module.exports={app};
