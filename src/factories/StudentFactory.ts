import { Student, StudentData, StudentCreateData } from '../models/Student';
import { StudentValidator } from '../validation/StudentValidator';
import { IValidator } from '../validation/interfaces';

export class StudentFactory {
  constructor(private validator: IValidator<StudentData> = new StudentValidator()) {}

  create(data: StudentData): Student {
    return new Student(data, this.validator);
  }

  createFromFormData(data: StudentCreateData): Student {
    const studentData: StudentData = {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      second_last_name: data.second_last_name?.trim(),
      birth_date: new Date(data.birth_date),
      school_name: data.school_name.trim()
    };

    return new Student(studentData, this.validator);
  }

  createFromDatabase(row: any): Student {
    const studentData: StudentData = {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      second_last_name: row.second_last_name,
      birth_date: new Date(row.birth_date),
      school_name: row.school_name,
      enrollment_date: new Date(row.enrollment_date),
      withdrawal_date: row.withdrawal_date ? new Date(row.withdrawal_date) : undefined,
      is_active: row.is_active
    };

    // No validamos datos que vienen de la BD (asumimos que son válidos)
    return new Student(studentData);
  }
}