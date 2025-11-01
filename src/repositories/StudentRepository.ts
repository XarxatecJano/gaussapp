import { IStudentRepository } from './interfaces';
import { IDatabaseConnection } from '../infrastructure/interfaces';
import { Student, StudentData } from '../models/Student';
import { StudentFactory } from '../factories/StudentFactory';
import { DatabaseStudentSerializer, DatabaseRow } from '../serializers/DatabaseStudentSerializer';

export class StudentRepository implements IStudentRepository {
  constructor(
    private db: IDatabaseConnection,
    private factory: StudentFactory,
    private serializer: DatabaseStudentSerializer
  ) {}

  async create(student: Student): Promise<Student> {
    const data = this.serializer.serialize(student);
    
    const sql = `
      INSERT INTO student (
        first_name, last_name, second_last_name, birth_date, 
        school_name, enrollment_date, withdrawal_date, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const params = [
      data.first_name,
      data.last_name,
      data.second_last_name,
      data.birth_date,
      data.school_name,
      data.enrollment_date,
      data.withdrawal_date,
      data.is_active
    ];

    const row = await this.db.queryOne<DatabaseRow>(sql, params);
    if (!row) {
      throw new Error('Failed to create student');
    }

    return this.factory.createFromDatabase(row);
  }

  async findById(id: number): Promise<Student | null> {
    const sql = 'SELECT * FROM student WHERE id = $1';
    const row = await this.db.queryOne<DatabaseRow>(sql, [id]);
    
    return row ? this.factory.createFromDatabase(row) : null;
  }

  async findAll(): Promise<Student[]> {
    const sql = 'SELECT * FROM student ORDER BY last_name, first_name';
    const rows = await this.db.query<DatabaseRow>(sql);
    
    return rows.map(row => this.factory.createFromDatabase(row));
  }

  async findByName(firstName: string, lastName: string): Promise<Student[]> {
    const sql = `
      SELECT * FROM student 
      WHERE LOWER(first_name) LIKE LOWER($1) 
      AND LOWER(last_name) LIKE LOWER($2)
      ORDER BY last_name, first_name
    `;
    
    const params = [`%${firstName}%`, `%${lastName}%`];
    const rows = await this.db.query<DatabaseRow>(sql, params);
    
    return rows.map(row => this.factory.createFromDatabase(row));
  }

  async findActiveStudents(): Promise<Student[]> {
    const sql = `
      SELECT * FROM student 
      WHERE is_active = true 
      ORDER BY last_name, first_name
    `;
    
    const rows = await this.db.query<DatabaseRow>(sql);
    return rows.map(row => this.factory.createFromDatabase(row));
  }

  async update(id: number, updates: Partial<Student>): Promise<Student | null> {
    // Primero obtenemos el estudiante actual
    const currentStudent = await this.findById(id);
    if (!currentStudent) {
      return null;
    }

    // Creamos el estudiante actualizado usando el método update inmutable
    const updatedStudent = currentStudent.update(updates);
    const data = this.serializer.serialize(updatedStudent);

    const sql = `
      UPDATE student SET
        first_name = $2,
        last_name = $3,
        second_last_name = $4,
        birth_date = $5,
        school_name = $6,
        enrollment_date = $7,
        withdrawal_date = $8,
        is_active = $9
      WHERE id = $1
      RETURNING *
    `;

    const params = [
      id,
      data.first_name,
      data.last_name,
      data.second_last_name,
      data.birth_date,
      data.school_name,
      data.enrollment_date,
      data.withdrawal_date,
      data.is_active
    ];

    const row = await this.db.queryOne<DatabaseRow>(sql, params);
    return row ? this.factory.createFromDatabase(row) : null;
  }

  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM student WHERE id = $1';
    const rows = await this.db.query(sql, [id]);
    return rows.length > 0;
  }

  async softDelete(id: number): Promise<boolean> {
    const sql = `
      UPDATE student SET 
        is_active = false, 
        withdrawal_date = CURRENT_TIMESTAMP 
      WHERE id = $1 AND is_active = true
    `;
    
    const rows = await this.db.query(sql, [id]);
    return rows.length > 0;
  }

  // Métodos adicionales útiles
  async countActiveStudents(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM student WHERE is_active = true';
    const result = await this.db.queryOne<{ count: string }>(sql);
    return parseInt(result?.count || '0');
  }

  async findBySchool(schoolName: string): Promise<Student[]> {
    const sql = `
      SELECT * FROM student 
      WHERE LOWER(school_name) LIKE LOWER($1) 
      AND is_active = true
      ORDER BY last_name, first_name
    `;
    
    const rows = await this.db.query<DatabaseRow>(sql, [`%${schoolName}%`]);
    return rows.map(row => this.factory.createFromDatabase(row));
  }

  async findByAgeRange(minAge: number, maxAge: number): Promise<Student[]> {
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const minBirthDate = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate());

    const sql = `
      SELECT * FROM student 
      WHERE birth_date BETWEEN $1 AND $2 
      AND is_active = true
      ORDER BY birth_date DESC
    `;
    
    const rows = await this.db.query<DatabaseRow>(sql, [minBirthDate, maxBirthDate]);
    return rows.map(row => this.factory.createFromDatabase(row));
  }
}