const { MongoClient, ObjectIdD } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/todoApp', (error, db) => {
    if (error) {
        return console.log("Unable to connect to mongo db server");
    }
    //delete many
    db.collection('Todos').deleteMany({text:'Duplicates'}).then((result)=>{},(error)=>{console.log(error);db.close()});
    //delete one
    db.collection('Todos').deleteOne({ text: 'Duplicates' }).then((result) => { }, (error) => { console.log(error); db.close() });
    //find and l=delete one
    db.collection('Todos').findOneAndDelete({ text: 'Duplicates' }).then((result) => { }, (error) => { console.log(error); db.close() });

});