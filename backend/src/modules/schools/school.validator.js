const { z } = require('zod');
const validate = require('../../middleware/validate.middleware');

const createSchema = z.object({
  name: z.string().trim().min(1),
  code: z.string().trim().toUpperCase(),
  slug: z.string().trim().toLowerCase(),
  board: z.string().optional(),
  logoUrl: z.string().url().or(z.string().length(0)).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().default('India')
  }).optional(),
  status: z.enum(['ACTIVE', 'TRIAL', 'SUSPENDED', 'INACTIVE']).optional(),
  subscription: z.object({
    plan: z.string().default('TRIAL'),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    maxStudents: z.number().default(500),
    maxStaff: z.number().default(100)
  }).optional(),
  settings: z.object({
    timezone: z.string().default('Asia/Kolkata'),
    currency: z.string().default('INR'),
    academicYearLabel: z.string().optional()
  }).optional()
}).strict();

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  code: z.string().trim().toUpperCase().optional(),
  slug: z.string().trim().toLowerCase().optional(),
  board: z.string().optional(),
  logoUrl: z.string().url().or(z.string().length(0)).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  status: z.enum(['ACTIVE', 'TRIAL', 'SUSPENDED', 'INACTIVE']).optional(),
  subscription: z.object({
    plan: z.string().optional(),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    maxStudents: z.number().optional(),
    maxStaff: z.number().optional()
  }).optional(),
  settings: z.object({
    timezone: z.string().optional(),
    currency: z.string().optional(),
    academicYearLabel: z.string().optional()
  }).optional()
}).strict();

module.exports = {
  create: [validate({ body: createSchema })],
  update: [validate({ body: updateSchema })]
};
