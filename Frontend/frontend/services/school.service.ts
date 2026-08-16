import{resource}from'./_resource';import type{School}from'@/types/school';export const schoolService=resource<School,Partial<School>>('/schools');
