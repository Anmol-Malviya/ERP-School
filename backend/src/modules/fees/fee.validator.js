const { z } = require('zod');
const validate = require('../../middleware/validate.middleware');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const feeCreateSchema = z.object({
  academicSessionId: objectIdSchema,
  name: z.string().trim().min(1),
  category: z.enum(['TUITION', 'TRANSPORT', 'EXAM', 'LIBRARY', 'ADMISSION', 'OTHER']).optional(),
  classId: objectIdSchema.optional(),
  studentId: objectIdSchema.optional(),
  amount: z.number().min(0),
  dueAt: z.coerce.date().optional(),
  lateFee: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
}).strict();

const feeUpdateSchema = z.object({
  academicSessionId: objectIdSchema.optional(),
  name: z.string().trim().min(1).optional(),
  category: z.enum(['TUITION', 'TRANSPORT', 'EXAM', 'LIBRARY', 'ADMISSION', 'OTHER']).optional(),
  classId: objectIdSchema.optional(),
  studentId: objectIdSchema.optional(),
  amount: z.number().min(0).optional(),
  dueAt: z.coerce.date().optional(),
  lateFee: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
}).strict();

const paymentCreateSchema = z.object({
  academicSessionId: objectIdSchema,
  feeId: objectIdSchema,
  studentId: objectIdSchema,
  amount: z.number().min(0),
  receiptNo: z.string().trim().min(1),
  mode: z.enum(['CASH', 'ONLINE', 'BANK_TRANSFER', 'CHEQUE', 'OTHER']).optional(),
  transactionRef: z.string().trim().optional(),
  paidAt: z.coerce.date().optional(),
  remarks: z.string().trim().optional(),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']).optional()
}).strict();

const paymentUpdateSchema = z.object({
  academicSessionId: objectIdSchema.optional(),
  feeId: objectIdSchema.optional(),
  studentId: objectIdSchema.optional(),
  amount: z.number().min(0).optional(),
  receiptNo: z.string().trim().min(1).optional(),
  mode: z.enum(['CASH', 'ONLINE', 'BANK_TRANSFER', 'CHEQUE', 'OTHER']).optional(),
  transactionRef: z.string().trim().optional(),
  paidAt: z.coerce.date().optional(),
  remarks: z.string().trim().optional(),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']).optional()
}).strict();

module.exports = {
  fee: {
    create: [validate({ body: feeCreateSchema })],
    update: [validate({ body: feeUpdateSchema })]
  },
  payment: {
    create: [validate({ body: paymentCreateSchema })],
    update: [validate({ body: paymentUpdateSchema })]
  }
};
