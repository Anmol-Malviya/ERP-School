const { createCrudService } = require('../_shared/crud.service');
const { SupportTicket } = require('../../models');
const { ROLES } = require('../../constants/roles');
const C = require('../../core');

const base = createCrudService({
  Model: SupportTicket,
  resource: 'SupportTicket',
  tenantScoped: false,
  beforeCreate: async (req, data) => {
    let schoolId = data.schoolId || req.user.schoolId;
    if (req.user.role === ROLES.ADMINISTRATOR) {
      if (schoolId && !(req.user.assignedSchoolIds || []).map(String).includes(String(schoolId))) {
        throw new C.ApiError(403, 'School not assigned');
      }
    }
    const cleanData = {
      subject: data.subject,
      description: data.description,
      priority: [ROLES.SUPER_ADMIN, ROLES.ADMINISTRATOR, ROLES.SCHOOL_ADMIN].includes(req.user.role) ? data.priority : 'MEDIUM',
      schoolId,
      openedBy: req.user._id
    };
    return cleanData;
  }
});

module.exports = {
  ...base,
  async list(req) {
    const { page, limit, skip } = C.page(req.query);
    let f = {};
    if (req.user.role === ROLES.ADMINISTRATOR) {
      f.schoolId = { $in: req.user.assignedSchoolIds || [] };
    } else if (req.user.role !== ROLES.SUPER_ADMIN) {
      f.schoolId = req.user.schoolId;
    }
    if ([ROLES.STUDENT, ROLES.PARENT].includes(req.user.role)) {
      f.openedBy = req.user._id;
    }
    
    const [total, items] = await Promise.all([
      SupportTicket.countDocuments(f),
      SupportTicket.find(f).sort('-createdAt').skip(skip).limit(limit).lean()
    ]);
    return { items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  },

  async get(req, id) {
    let f = { _id: id };
    if (req.user.role === ROLES.ADMINISTRATOR) {
      f.schoolId = { $in: req.user.assignedSchoolIds || [] };
    } else if (req.user.role !== ROLES.SUPER_ADMIN) {
      f.schoolId = req.user.schoolId;
    }
    if ([ROLES.STUDENT, ROLES.PARENT].includes(req.user.role)) {
      f.openedBy = req.user._id;
    }
    
    const item = await SupportTicket.findOne(f).lean();
    if (!item) throw new C.ApiError(404, 'Ticket not found');
    return item;
  },

  async update(req, id) {
    let f = { _id: id };
    if (req.user.role !== ROLES.SUPER_ADMIN) {
      f.$or = [{ openedBy: req.user._id }, { schoolId: req.user.schoolId }];
    }
    
    const ticket = await SupportTicket.findOne(f);
    if (!ticket) throw new C.ApiError(404, 'Ticket not found');
    
    const r = req.user.role;
    const updateData = req.body;
    
    if (r === ROLES.SUPER_ADMIN) {
      if (updateData.status) ticket.status = updateData.status;
      if (updateData.priority) ticket.priority = updateData.priority;
      if (updateData.assignedTo) ticket.assignedTo = updateData.assignedTo;
    } else if (r === ROLES.SCHOOL_ADMIN || r === ROLES.ADMINISTRATOR) {
      if (updateData.status) ticket.status = updateData.status;
      if (updateData.priority) ticket.priority = updateData.priority;
    }
    
    if (updateData.comment) {
      ticket.comments.push({
        userId: req.user._id,
        message: String(updateData.comment).trim()
      });
    }
    
    await ticket.save();
    return ticket;
  }
};
