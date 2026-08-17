const { z } = require('zod');
const validate = require('../../middleware/validate.middleware');
const { ROLE_VALUES } = require('../../constants/roles');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const createSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.enum(ROLE_VALUES),
  phone: z.string().trim().optional(),
  avatarUrl: z.string().trim().url().or(z.string().length(0)).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  assignedSchoolIds: z.array(objectIdSchema).optional(),
  permissions: z.array(z.string()).optional()
}).strict();

const updateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  avatarUrl: z.string().trim().url().or(z.string().length(0)).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  assignedSchoolIds: z.array(objectIdSchema).optional(),
  permissions: z.array(z.string()).optional()
}).strict();

module.exports = {
  create: [validate({ body: createSchema })],
  update: [validate({ body: updateSchema })]
};
