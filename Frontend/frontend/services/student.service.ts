import{resource}from'./_resource';import type{Student}from'@/types/student';export const studentService=resource<Student,Partial<Student>>('/students');
