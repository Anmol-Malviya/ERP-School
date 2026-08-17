const { z } = require('zod');
const validate = require('../../middleware/validate.middleware');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const createSchema = z.object({
  employeeCode: z.string().trim().min(1),
  name: z.string().trim().min(1),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  department: z.string().trim().optional(),
  designation: z.string().trim().default('Teacher').optional(),
  subjectIds: z.array(objectIdSchema).optional(),
  classAssignments: z.array(z.object({
    academicSessionId: objectIdSchema,
    classId: objectIdSchema,
    sectionId: objectIdSchema,
    subjectId: objectIdSchema
  })).optional(),
  joiningDate: z.coerce.date().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional()
}).strict();

const updateSchema = z.object({
  employeeCode: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  department: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  subjectIds: z.array(objectIdSchema).optional(),
  classAssignments: z.array(z.object({
    academicSessionId: objectIdSchema.optional(),
    classId: objectIdSchema.optional(),
    sectionId: objectIdSchema.optional(),
    subjectId: objectIdSchema.optional()
  })).optional(),
  joiningDate: z.coerce.date().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional()
}).strict();

module.exports = {
  create: [validate({ body: createSchema })],
  update: [validate({ body: updateSchema })]
};
