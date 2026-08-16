const {ROLES}=require('../../src/constants/roles');test('role constants keep tenant roles explicit',()=>{expect(ROLES.SCHOOL_ADMIN).toBe('SCHOOL_ADMIN');expect(ROLES.STUDENT).toBe('STUDENT')});
