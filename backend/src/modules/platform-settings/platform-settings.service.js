const { PlatformSetting } = require('../../models');
const C = require('../../core');

module.exports = {
  async getSetting(req, key) {
    const row = await PlatformSetting.findOne({ key }).lean();
    return row?.value ?? null;
  },

  async saveSetting(req, key) {
    const row = await PlatformSetting.findOneAndUpdate(
      { key },
      { $set: { value: req.body.value, updatedBy: req.user._id } },
      { new: true, upsert: true }
    );
    return row.value;
  }
};
