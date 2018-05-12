const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('../server/db/mongo');
const {
    Todo
} = require('../server/models/Todo');
/* Remove all */
/* Todo.remove({}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(e)
}); */
/* find one and remove */
/* Todo.findOneAndRemove({
    _id: 56
}).then((doc) => {
    console.log(doc)
}).catch((e) => {
    console.log(e)
}); */

/* Remove by id */
Todo.findByIdAndRemove('5af68f8731ac14161d2a9c8a').then((doc) => {
    console.log(doc);
}).catch((e) => {
    console.log(e)
});