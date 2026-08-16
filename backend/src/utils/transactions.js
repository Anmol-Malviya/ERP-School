const mongoose = require('mongoose');

/**
 * Execute a function within a Mongoose transaction session.
 * @param {Function} fn - Async function to execute inside the transaction. Receives the session object as its first argument.
 * @returns {Promise<any>}
 */
async function runInTransaction(fn) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

module.exports = { runInTransaction };
