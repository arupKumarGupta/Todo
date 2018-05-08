const {MongoClient,ObjectIdD} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/todoApp',(error,db)=>{
    if(error){
        return console.log("Unable to connect to mongo db server");
    }
    console.log("Connected to mongoDb");
    /* db.collection('Todos').insertOne({
        text: 'Duplicates',
        completed: false
    },(error,result)=>{
        if(error){
            return console.log("Unable to add todo",error);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    }); */
    db.collection('Users').insertOne({
        name:'Arup Kumar Gupta',
        age: 21,
        contact: '8377040118'
    },(error,result)=>{
        if(error)
            return console.log("Unable to add user",error);
        console.log(JSON.stringify(result.ops,undefined,2));
    });
    db.close();
});