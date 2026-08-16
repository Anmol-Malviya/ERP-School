const { createCrudService } = require('../_shared/crud.service');
const { CalendarEvent } = require('../../models');
const N = require('../../services/notification.service');
const queueService = require('../../services/queue.service');

const base = createCrudService({
  Model: CalendarEvent,
  resource: 'CalendarEvent',
  filterFields: ['type', 'academicSessionId'],
  beforeCreate: async (req, data) => ({
    ...data,
    schoolId: req.tenantId || req.user.schoolId,
    createdBy: req.user._id
  })
});

module.exports = {
  ...base,
  async create(req) {
    const item = await base.create(req);
    // Queue notification if enabled, otherwise sync fallback
    await queueService.addNotificationJob('CALENDAR_EVENT', {
      schoolId: req.tenantId || req.user.schoolId,
      audience: item.audience,
      title: item.title,
      message: item.description || 'New calendar event',
      type: 'CALENDAR',
      link: '/student/calendar'
    });
    return item;
  }
};
