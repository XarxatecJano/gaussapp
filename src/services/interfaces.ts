import { Student, StudentCreateData, StudentUpdateData } from '../models/Student';

export interface IStudentService {
  // Historia 1: Dar de alta un alumno
  createStudent(data: StudentCreateData): Promise<Student>;
  
  // Historia 2: Buscar y actualizar datos de un alumno
  searchStudentsByName(firstName: string, lastName: string): Promise<Student[]>;
  updateStudent(id: number, data: StudentUpdateData): Promise<Student>;
  getStudentById(id: number): Promise<Student>;
  
  // Historia 3: Eliminar un alumno
  deleteStudent(id: number): Promise<void>;
  
  // Métodos adicionales útiles
  getAllStudents(): Promise<Student[]>;
  getActiveStudents(): Promise<Student[]>;
  reactivateStudent(id: number): Promise<Student>;
}

export class StudentNotFoundError extends Error {
  constructor(id: number) {
    super(`Student with id ${id} not found`);
    this.name = 'StudentNotFoundError';
  }
}

export class StudentAlreadyInactiveError extends Error {
  constructor(id: number) {
    super(`Student with id ${id} is already inactive`);
    this.name = 'StudentAlreadyInactiveError';
  }
}

export class DuplicateStudentError extends Error {
  constructor(firstName: string, lastName: string, birthDate: Date) {
    super(`Student ${firstName} ${lastName} born on ${birthDate.toISOString().split('T')[0]} already exists`);
    this.name = 'DuplicateStudentError';
  }
}