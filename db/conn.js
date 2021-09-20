const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    dbName:process.env.DB_NAME,
    useNewUrlParser:true
}).then(()=>{
    console.log('connection is successful')
}).catch((error)=>{
    console.log(error);
})


mongoose.connection.on('connected',()=>{
    console.log('mongoose connected to db');
})

mongoose.connection.on('error',(err)=>{
console.log(err.message);
})

mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose connection is disconnected');
})

process.on('SIGINT',async ()=>{
    await mongoose.connection.close()
    process.exit(0);
})