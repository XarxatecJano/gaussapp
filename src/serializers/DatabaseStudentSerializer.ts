import { ISerializer, IDeserializer } from './interfaces';
import { Student, StudentData } from '../models/Student';

export interface DatabaseRow {
  id?: number;
  first_name: string;
  last_name: string;
  second_last_name?: string | null;
  birth_date: Date | string;
  school_name: string;
  enrollment_date: Date | string;
  withdrawal_date?: Date | string | null;
  is_active: boolean;
}

export class DatabaseStudentSerializer implements ISerializer<Student, DatabaseRow>, IDeserializer<DatabaseRow, StudentData> {
  serialize(student: Student): DatabaseRow {
    return {
      id: student.id,
      first_name: student.first_name,
      last_name: student.last_name,
      second_last_name: student.second_last_name || null,
      birth_date: student.birth_date,
      school_name: student.school_name,
      enrollment_date: student.enrollment_date,
      withdrawal_date: student.withdrawal_date || null,
      is_active: student.is_active
    };
  }

  deserialize(row: DatabaseRow): StudentData {
    return {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      second_last_name: row.second_last_name || undefined,
      birth_date: new Date(row.birth_date),
      school_name: row.school_name,
      enrollment_date: new Date(row.enrollment_date),
      withdrawal_date: row.withdrawal_date ? new Date(row.withdrawal_date) : undefined,
      is_active: row.is_active
    };
  }
}