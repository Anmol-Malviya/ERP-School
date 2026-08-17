const { z } = require('zod');
const validate = require('../../middleware/validate.middleware');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const createSchema = z.object({
  academicSessionId: objectIdSchema,
  examinationId: objectIdSchema,
  studentId: objectIdSchema,
  classId: objectIdSchema,
  sectionId: objectIdSchema,
  marks: z.array(z.object({
    subjectId: objectIdSchema,
    marksObtained: z.number().min(0),
    maxMarks: z.number().min(0),
    grade: z.string().optional(),
    remarks: z.string().optional()
  })).optional(),
  rank: z.number().optional(),
  published: z.boolean().optional()
}).strict();

const updateSchema = z.object({
  academicSessionId: objectIdSchema.optional(),
  examinationId: objectIdSchema.optional(),
  studentId: objectIdSchema.optional(),
  classId: objectIdSchema.optional(),
  sectionId: objectIdSchema.optional(),
  marks: z.array(z.object({
    subjectId: objectIdSchema.optional(),
    marksObtained: z.number().min(0).optional(),
    maxMarks: z.number().min(0).optional(),
    grade: z.string().optional(),
    remarks: z.string().optional()
  })).optional(),
  rank: z.number().optional(),
  published: z.boolean().optional()
}).strict();

module.exports = {
  create: [validate({ body: createSchema })],
  update: [validate({ body: updateSchema })]
};
