const { MongoClient, ObjectIdD } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/todoApp', (error, db) => {
    if (error) {
        return console.log("Unable to connect to mongo db server");
    }
    db.collection('Todos').find(/* not req to fetch all */{ completed: false }).toArray().then((docs)=>{
        console.log('Todos:\n');
        console.log(JSON.stringify(docs,undefined,2));
        //db.close();
        
    },(error)=>{
        console.log("Unable to fetch todos", error);
    });
    db.collection('Todos').find().count().then((count) => {
       
        console.log(`Todo Count : ${count}`);
        db.close();

    }, (error) => {
        console.log("Unable to fetch todos", error);
    });
});