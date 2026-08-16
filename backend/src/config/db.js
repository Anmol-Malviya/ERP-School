const mongoose=require('mongoose');const config=require('./env');
async function connectDB(){mongoose.set('strictQuery',true);return mongoose.connect(config.mongoUri,{autoIndex:config.nodeEnv!=='production',maxPoolSize:30,minPoolSize:2,serverSelectionTimeoutMS:10000})}
async function disconnectDB(){if(mongoose.connection.readyState!==0)await mongoose.disconnect()}
module.exports={connectDB,disconnectDB};
