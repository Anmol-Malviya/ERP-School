const { z } = require('zod');
const validate = require('../../middleware/validate.middleware');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const createSchema = z.object({
  academicSessionId: objectIdSchema,
  admissionNo: z.string().trim().min(1),
  rollNo: z.string().trim().optional(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED']).optional(),
  classId: objectIdSchema,
  sectionId: objectIdSchema,
  parentIds: z.array(objectIdSchema).optional(),
  bloodGroup: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.object({
    line1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional()
  }).optional(),
  documents: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    verified: z.boolean().default(false)
  })).optional(),
  admissionDate: z.coerce.date().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED']).optional()
}).strict();

const updateSchema = z.object({
  academicSessionId: objectIdSchema.optional(),
  admissionNo: z.string().trim().min(1).optional(),
  rollNo: z.string().trim().optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED']).optional(),
  classId: objectIdSchema.optional(),
  sectionId: objectIdSchema.optional(),
  parentIds: z.array(objectIdSchema).optional(),
  bloodGroup: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.object({
    line1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional()
  }).optional(),
  documents: z.array(z.object({
    name: z.string().optional(),
    url: z.string().url().optional(),
    verified: z.boolean().optional()
  })).optional(),
  admissionDate: z.coerce.date().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED']).optional()
}).strict();

module.exports = {
  create: [validate({ body: createSchema })],
  update: [validate({ body: updateSchema })]
};
