const mongoose=require('mongoose');const config=require('./env');
async function connectDB(){
  mongoose.set('strictQuery',true);
  return mongoose.connect(config.mongoUri,{
    autoIndex:config.nodeEnv!=='production',
    maxPoolSize:config.mongo.maxPoolSize,
    minPoolSize:config.mongo.minPoolSize,
    maxConnecting:config.mongo.maxConnecting,
    waitQueueTimeoutMS:config.mongo.waitQueueTimeoutMS,
    serverSelectionTimeoutMS:config.mongo.serverSelectionTimeoutMS
  });
}
async function disconnectDB(){if(mongoose.connection.readyState!==0)await mongoose.disconnect()}
module.exports={connectDB,disconnectDB};
