const Notification=require('../modules/notifications/notification.model');
async function cleanupReadNotifications({olderThanDays=90}={}){const before=new Date(Date.now()-olderThanDays*86400000);return Notification.deleteMany({readAt:{$ne:null},createdAt:{$lt:before}})}
module.exports={cleanupReadNotifications};
