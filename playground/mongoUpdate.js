const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/todoApp', (error, db) => {
    if (error) {
        return console.log("Unable to connect to mongo db server");
    }
  

   /*  db.collection('Todos').findOneAndUpdate({ _id: new ObjectID('5aec845876952512a48e1765')},{
        $set:{
            text: 'text changed!'
        }
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
    },(error)=>{}); */
    db.collection('Users').findOneAndUpdate({_id:new ObjectID("5af1c81f2a5a0e32c97c4ed5")},
    {
            $set:{
                name : 'Arup'
        },
        $inc:{
            age: -1
        }
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
        db.close();
    },(error)=>{
        console.log(result);
        db.close();
    });

});