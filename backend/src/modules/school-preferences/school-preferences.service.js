const { SchoolPreference } = require('../../models');

module.exports = {
  async get(req) {
    const row = await SchoolPreference.findOne({ schoolId: req.tenantId }).lean();
    return row || { schoolId: req.tenantId, allowOnlinePayments: false, settings: {} };
  },

  async update(req) {
    const set = {};
    if (Object.prototype.hasOwnProperty.call(req.body, 'allowOnlinePayments')) {
      set.allowOnlinePayments = Boolean(req.body.allowOnlinePayments);
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'settings')) {
      set.settings = req.body.settings && typeof req.body.settings === 'object' ? req.body.settings : {};
    }

    return SchoolPreference.findOneAndUpdate(
      { schoolId: req.tenantId },
      { $set: set, $setOnInsert: { schoolId: req.tenantId } },
      { new: true, upsert: true, runValidators: true }
    );
  }
};
