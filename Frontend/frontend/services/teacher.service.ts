import{resource}from'./_resource';import type{Teacher}from'@/types/teacher';export const teacherService=resource<Teacher,Partial<Teacher>>('/teachers');
