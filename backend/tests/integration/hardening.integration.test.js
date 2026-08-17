process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../../src/config/db');
const { runInTransaction } = require('../../src/utils/transactions');
const M = require('../../src/models');
const E = M;
const pay = require('../../src/payments/razorpay');
const paymentsService = require('../../src/modules/payments/payments.service');

describe('Hardening, Tenant Isolation, and Transaction Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    // Clean up test data
    await M.Student.deleteMany({ admissionNo: 'TEST-TX-ROLLBACK-999' });
    await E.OnlinePaymentIntent.deleteMany({ providerId: 'plink_test_webhook_123' });
    await M.Payment.deleteMany({ receiptNo: 'RZP-pay_test_payment_123' });
    await disconnectDB();
  });

  test('runInTransaction should rollback changes on error', async () => {
    const admissionNo = 'TEST-TX-ROLLBACK-999';
    await M.Student.deleteMany({ admissionNo });

    const sessionPromise = runInTransaction(async (session) => {
      // Create a student instance and save within session
      const student = new M.Student({
        schoolId: new mongoose.Types.ObjectId(),
        academicSessionId: new mongoose.Types.ObjectId(),
        classId: new mongoose.Types.ObjectId(),
        sectionId: new mongoose.Types.ObjectId(),
        admissionNo,
        firstName: 'Transaction',
        lastName: 'RollbackTest',
        status: 'ACTIVE'
      });
      await student.save({ session });

      // Raise an error midway to trigger rollback
      throw new Error('Simulation of transaction failure');
    });

    await expect(sessionPromise).rejects.toThrow('Simulation of transaction failure');

    // Query outside session to verify rollback
    const doc = await M.Student.findOne({ admissionNo });
    expect(doc).toBeNull();
  });

  test('Multi-tenant boundary: schoolId filtering must remain explicit', async () => {
    const schoolA = new mongoose.Types.ObjectId();
    const schoolB = new mongoose.Types.ObjectId();

    const studentA = await M.Student.create([{
      schoolId: schoolA,
      academicSessionId: new mongoose.Types.ObjectId(),
      classId: new mongoose.Types.ObjectId(),
      sectionId: new mongoose.Types.ObjectId(),
      admissionNo: 'TEST-A-1',
      firstName: 'Tenant A',
      status: 'ACTIVE'
    }]);

    // Query for studentA with schoolB's context - should return null
    const queryResult = await M.Student.findOne({ _id: studentA[0]._id, schoolId: schoolB });
    expect(queryResult).toBeNull();

    // Clean up
    await M.Student.deleteOne({ _id: studentA[0]._id });
  });

  test('Razorpay Webhook: Idempotency duplicate webhook check', async () => {
    const schoolId = new mongoose.Types.ObjectId();
    const sessionId = new mongoose.Types.ObjectId();
    const studentId = new mongoose.Types.ObjectId();
    const feeId = new mongoose.Types.ObjectId();

    // Setup an OnlinePaymentIntent for the webhook to match
    const intent = await E.OnlinePaymentIntent.create({
      schoolId,
      academicSessionId: sessionId,
      studentId,
      feeId,
      providerId: 'plink_test_webhook_123',
      referenceId: 'ref_123',
      amount: 1500,
      status: 'CREATED',
      raw: {}
    });

    // Mock pay.verify to always return true for testing
    const originalVerify = pay.verify;
    pay.verify = () => true;

    const mockPayload = {
      event: 'payment_link.paid',
      payload: {
        payment_link: {
          entity: {
            id: 'plink_test_webhook_123',
            status: 'paid'
          }
        },
        payment: {
          entity: {
            id: 'pay_test_payment_123'
          }
        }
      }
    };

    const reqMock = {
      body: Buffer.from(JSON.stringify(mockPayload)),
      headers: {
        'x-razorpay-signature': 'mock_signature'
      }
    };

    // First call: should record payment successfully
    const firstResult = await paymentsService.webhookHandler(reqMock);
    expect(firstResult.success).toBe(true);
    expect(firstResult.duplicate).toBeUndefined();

    // Second call: should detect duplicate payment receipt gracefully and ignore
    const secondResult = await paymentsService.webhookHandler(reqMock);
    expect(secondResult.success).toBe(true);
    expect(secondResult.duplicate).toBe(true);

    // Restore original verify method
    pay.verify = originalVerify;
  });
});
