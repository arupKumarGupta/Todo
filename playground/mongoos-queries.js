const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('../server/db/mongo');
/* For Todo -- uncomment below to run the code */
/* const {
    Todo
} = require('../server/models/Todo');
let id = "5af485a642eefc2c91f38c72";
Todo.find({completed:false}).then((todos)=>{
    console.log(todos);
},(err)=>{console.log(err)});
Todo.findOne({completed:false}).then((todo)=>{
    console.log(todo);
},(err)=>{
    console.log(err);
});
if (ObjectID.isValid(id))
    Todo.findById(id).then((todo) => {
        console.log(todo ? todo : "No records found")
    }, (err) => {
        console.log(err)
    });
else
    console.log("Invalid id"); */

/* For User */
const {
    User
} = require('../server/models/User');
let userId = '5af1e94c1beb9e6178cf86da';
if (!ObjectID.isValid(userId))
    return console.log("Invalid User Id");
User.findById(userId).then((user) => {
    if (!user) {
        return console.log('No user found!');
    }
    console.log(user);
}).catch((error) => {
    console.log(error);
});