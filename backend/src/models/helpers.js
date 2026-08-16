const mongoose = require('mongoose');
const { Schema } = mongoose;

const id = (ref, options = {}) => ({ type: Schema.Types.ObjectId, ref, ...options });
const model = (name, schema) => mongoose.models[name] || mongoose.model(name, schema);

module.exports = { mongoose, Schema, id, model };
