import { ISerializer } from './interfaces';
import { Student } from '../models/Student';

export interface ApiStudentResponse {
  id?: number;
  first_name: string;
  last_name: string;
  second_last_name?: string;
  full_name: string;
  birth_date: string; // YYYY-MM-DD format
  age: number;
  school_name: string;
  enrollment_date: string; // ISO string
  withdrawal_date?: string; // ISO string
  is_active: boolean;
}

export class ApiStudentSerializer implements ISerializer<Student, ApiStudentResponse> {
  serialize(student: Student): ApiStudentResponse {
    return {
      id: student.id,
      first_name: student.first_name,
      last_name: student.last_name,
      second_last_name: student.second_last_name,
      full_name: student.getFullName(),
      birth_date: student.birth_date.toISOString().split('T')[0], // YYYY-MM-DD
      age: student.getAge(),
      school_name: student.school_name,
      enrollment_date: student.enrollment_date.toISOString(),
      withdrawal_date: student.withdrawal_date?.toISOString(),
      is_active: student.is_active
    };
  }
}