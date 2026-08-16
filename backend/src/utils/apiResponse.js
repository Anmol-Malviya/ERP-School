function success(res, data = null, message = 'Success', statusCode = 200, meta) {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
}
module.exports = { success };
