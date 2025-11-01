import { Student } from "../models/Student";

export interface IRepository<T, ID> {
  create(entity: T): Promise<T>;
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: ID, entity: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

export interface IStudentRepository extends IRepository<Student, number> {
  findByName(firstName: string, lastName: string): Promise<Student[]>;
  findActiveStudents(): Promise<Student[]>;
  softDelete(id: number): Promise<boolean>;
}
