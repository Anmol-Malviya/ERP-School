const dotenv=require('dotenv');dotenv.config();
const n=(v,d)=>Number.isFinite(Number(v))?Number(v):d;
const config={
 nodeEnv:process.env.NODE_ENV||'development',port:n(process.env.PORT,5000),mongoUri:process.env.MONGO_URI||'mongodb://127.0.0.1:27017/erp-school',
 mongo:{maxPoolSize:n(process.env.MONGO_MAX_POOL_SIZE,40),minPoolSize:n(process.env.MONGO_MIN_POOL_SIZE,5),maxConnecting:n(process.env.MONGO_MAX_CONNECTING,5),waitQueueTimeoutMS:n(process.env.MONGO_WAIT_QUEUE_TIMEOUT_MS,3000),serverSelectionTimeoutMS:n(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS,10000)},
 redisUrl:process.env.REDIS_URL||'',
 accessSecret:process.env.JWT_ACCESS_SECRET||'dev-access-secret-change-me',refreshSecret:process.env.JWT_REFRESH_SECRET||'dev-refresh-secret-change-me',accessExpiresIn:process.env.JWT_ACCESS_EXPIRES_IN||'15m',refreshExpiresIn:process.env.JWT_REFRESH_EXPIRES_IN||'7d',
 corsOrigins:(process.env.CORS_ORIGINS||'http://localhost:3000,http://localhost:3001').split(',').map(x=>x.trim()).filter(Boolean),rateLimitWindowMs:n(process.env.RATE_LIMIT_WINDOW_MS,900000),rateLimitMax:n(process.env.RATE_LIMIT_MAX,300),
 cookieName:process.env.REFRESH_COOKIE_NAME||'erp_refresh',cookieSecure:process.env.COOKIE_SECURE==='true'||process.env.NODE_ENV==='production',cookieSameSite:process.env.COOKIE_SAME_SITE||'lax',
 portalUrl:process.env.PORTAL_URL||'http://localhost:3000',superadminUrl:process.env.SUPERADMIN_URL||'http://localhost:3001',uploadDir:process.env.UPLOAD_DIR||'uploads',uploadMaxBytes:n(process.env.UPLOAD_MAX_BYTES,5*1024*1024),
 razorpay:{keyId:process.env.RAZORPAY_KEY_ID||'',keySecret:process.env.RAZORPAY_KEY_SECRET||'',webhookSecret:process.env.RAZORPAY_WEBHOOK_SECRET||''},
 cloudinary:{cloudName:process.env.CLOUDINARY_CLOUD_NAME||'',apiKey:process.env.CLOUDINARY_API_KEY||'',apiSecret:process.env.CLOUDINARY_API_SECRET||'',folder:process.env.CLOUDINARY_FOLDER||'erp-school'},
 superAdmin:{name:process.env.SUPER_ADMIN_NAME||'Platform Super Admin',email:process.env.SUPER_ADMIN_EMAIL||'admin@schoolerp.local',password:process.env.SUPER_ADMIN_PASSWORD||'ChangeMe123!'}
};
if(config.nodeEnv==='production'&&(config.accessSecret.startsWith('dev-')||config.refreshSecret.startsWith('dev-')))throw new Error('JWT secrets must be configured in production');
module.exports=config;
