const { requireFields } = require('../../validators/common.validator');
module.exports = ({required=[]}={}) => ({ create: required.length?[requireFields(...required)]:[], update:[] });
