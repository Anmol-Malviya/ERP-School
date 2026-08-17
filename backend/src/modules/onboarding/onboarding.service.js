const M = require('../../models');
const E = require('../../models');
const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const { runInTransaction } = require('../../utils/transactions');

async function uniqueUser(email, session) {
  const exists = await M.User.exists({ email: String(email).toLowerCase() }).session(session);
  if (exists) throw new C.ApiError(409, 'Email already exists');
}

const onboardingService = {
  async onboardSchool(req) {
    const { name, code, slug, adminName, adminEmail, adminPassword, planId } = req.body;
    if (!name || !code || !slug || !adminName || !adminEmail || !adminPassword) {
      throw new C.ApiError(400, 'School and first administrator details are required');
    }

    return runInTransaction(async (session) => {
      await uniqueUser(adminEmail, session);

      // Create school
      const [school] = await M.School.create([{
        name,
        code,
        slug,
        board: req.body.board,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        status: req.body.status || 'TRIAL',
        createdBy: req.user._id
      }], { session });

      // Create admin user
      const [admin] = await M.User.create([{
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: ROLES.SCHOOL_ADMIN,
        schoolId: school._id
      }], { session });

      // Create subscription if planId is provided
      let subscription = null;
      if (planId) {
        [subscription] = await E.Subscription.create([{
          schoolId: school._id,
          planId,
          status: 'TRIAL',
          endsAt: req.body.endsAt
        }], { session });
      }

      await C.audit(req, 'ONBOARD', 'School', school._id, { adminId: admin._id });

      return { school, admin: admin.toJSON(), subscription };
    });
  },

  async onboardAdministrator(req) {
    const { name, email, password, assignedSchoolIds = [] } = req.body;
    if (!name || !email || !password) {
      throw new C.ApiError(400, 'name, email and password are required');
    }

    return runInTransaction(async (session) => {
      await uniqueUser(email, session);

      const [u] = await M.User.create([{
        name,
        email,
        password,
        role: ROLES.ADMINISTRATOR,
        assignedSchoolIds
      }], { session });

      const [profile] = await M.Administrator.create([{
        userId: u._id,
        assignedSchoolIds,
        designation: req.body.designation || 'Administrator',
        employeeCode: req.body.employeeCode
      }], { session });

      return { user: u.toJSON(), profile };
    });
  },

  async onboardSchoolAdmin(req) {
    if (![ROLES.SUPER_ADMIN, ROLES.ADMINISTRATOR].includes(req.user.role)) {
      throw new C.ApiError(403, 'Not allowed');
    }
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      throw new C.ApiError(400, 'name, email and password are required');
    }

    return runInTransaction(async (session) => {
      await uniqueUser(email, session);

      const [u] = await M.User.create([{
        name,
        email,
        password,
        phone,
        role: ROLES.SCHOOL_ADMIN,
        schoolId: req.tenantId
      }], { session });

      return u.toJSON();
    });
  },

  async onboardTeacher(req) {
    const { name, email, password, employeeCode } = req.body;
    if (!name || !email || !password || !employeeCode) {
      throw new C.ApiError(400, 'name, email, password and employeeCode are required');
    }

    return runInTransaction(async (session) => {
      await uniqueUser(email, session);

      const [u] = await M.User.create([{
        name,
        email,
        password,
        phone: req.body.phone,
        role: ROLES.TEACHER,
        schoolId: req.tenantId
      }], { session });

      const [profile] = await M.Teacher.create([{
        schoolId: req.tenantId,
        userId: u._id,
        employeeCode,
        name,
        email,
        phone: req.body.phone,
        department: req.body.department,
        designation: req.body.designation || 'Teacher',
        subjectIds: req.body.subjectIds || [],
        classAssignments: req.body.classAssignments || [],
        joiningDate: req.body.joiningDate || new Date()
      }], { session });

      return { user: u.toJSON(), profile };
    });
  },

  async onboardStudent(req) {
    const { firstName, email, password, academicSessionId, admissionNo, classId, sectionId } = req.body;
    if (!firstName || !email || !password || !academicSessionId || !admissionNo || !classId || !sectionId) {
      throw new C.ApiError(400, 'Student identity and academic allocation are required');
    }

    return runInTransaction(async (session) => {
      await uniqueUser(email, session);

      const [u] = await M.User.create([{
        name: `${firstName} ${req.body.lastName || ''}`.trim(),
        email,
        password,
        phone: req.body.phone,
        role: ROLES.STUDENT,
        schoolId: req.tenantId
      }], { session });

      const [student] = await M.Student.create([{
        schoolId: req.tenantId,
        userId: u._id,
        academicSessionId,
        admissionNo,
        rollNo: req.body.rollNo,
        firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        classId,
        sectionId,
        phone: req.body.phone,
        admissionDate: req.body.admissionDate || new Date()
      }], { session });

      const [enrollment] = await E.Enrollment.create([{
        schoolId: req.tenantId,
        studentId: student._id,
        academicSessionId,
        classId,
        sectionId,
        rollNo: req.body.rollNo
      }], { session });

      return { user: u.toJSON(), student, enrollment };
    });
  },

  async onboardParent(req) {
    const { name, email, password, phone, studentIds = [] } = req.body;
    if (!name || !email || !password || !phone) {
      throw new C.ApiError(400, 'Parent identity is required');
    }

    return runInTransaction(async (session) => {
      const allowed = await M.Student.countDocuments({ _id: { $in: studentIds }, schoolId: req.tenantId }).session(session);
      if (allowed !== studentIds.length) {
        throw new C.ApiError(400, 'One or more students are invalid');
      }

      await uniqueUser(email, session);

      const [u] = await M.User.create([{
        name,
        email,
        password,
        phone,
        role: ROLES.PARENT,
        schoolId: req.tenantId
      }], { session });

      const [parent] = await M.Parent.create([{
        schoolId: req.tenantId,
        userId: u._id,
        name,
        email,
        phone,
        relation: req.body.relation || 'GUARDIAN',
        occupation: req.body.occupation,
        studentIds
      }], { session });

      // Link children
      await M.Student.updateMany(
        { _id: { $in: studentIds } },
        { $addToSet: { parentIds: parent._id } },
        { session }
      );

      return { user: u.toJSON(), parent };
    });
  }
};

module.exports = onboardingService;
