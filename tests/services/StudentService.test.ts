import { StudentService } from '../../src/services/StudentService';
import { 
  StudentNotFoundError, 
  StudentAlreadyInactiveError,
  DuplicateStudentError 
} from '../../src/services/interfaces';
import { IStudentRepository } from '../../src/repositories/interfaces';
import { StudentFactory } from '../../src/factories/StudentFactory';
import { Student, StudentCreateData } from '../../src/models/Student';
import { ValidationError } from '../../src/validation/ValidationError';

// Mock del Repository
class MockStudentRepository implements IStudentRepository {
  private students: Student[] = [];
  private nextId = 1;

  async create(student: Student): Promise<Student> {
    const newStudent = new Student({
      ...student,
      id: this.nextId++
    });
    this.students.push(newStudent);
    return newStudent;
  }

  async findById(id: number): Promise<Student | null> {
    return this.students.find(s => s.id === id) || null;
  }

  async findAll(): Promise<Student[]> {
    return [...this.students];
  }

  async findByName(firstName: string, lastName: string): Promise<Student[]> {
    return this.students.filter(s =>
      s.first_name.toLowerCase().includes(firstName.toLowerCase()) &&
      s.last_name.toLowerCase().includes(lastName.toLowerCase())
    );
  }

  async findActiveStudents(): Promise<Student[]> {
    return this.students.filter(s => s.is_active);
  }

  async update(id: number, updates: Partial<Student>): Promise<Student | null> {
    const index = this.students.findIndex(s => s.id === id);
    if (index < 0) return null;

    const current = this.students[index];
    const updated = current.update(updates);
    const newStudent = new Student({ ...updated, id });
    this.students[index] = newStudent;
    return newStudent;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.students.findIndex(s => s.id === id);
    if (index < 0) return false;
    this.students.splice(index, 1);
    return true;
  }

  async softDelete(id: number): Promise<boolean> {
    const student = await this.findById(id);
    if (!student || !student.is_active) return false;
    
    student.withdraw();
    return true;
  }

  async countActiveStudents(): Promise<number> {
    return this.students.filter(s => s.is_active).length;
  }

  async findBySchool(schoolName: string): Promise<Student[]> {
    return this.students.filter(s =>
      s.school_name.toLowerCase().includes(schoolName.toLowerCase()) &&
      s.is_active
    );
  }

  async findByAgeRange(minAge: number, maxAge: number): Promise<Student[]> {
    return this.students.filter(s => {
      const age = s.getAge();
      return age >= minAge && age <= maxAge && s.is_active;
    });
  }

  // Métodos adicionales del mock
  setStudents(students: Student[]) {
    this.students = students;
  }

  clear() {
    this.students = [];
    this.nextId = 1;
  }
}

describe('StudentService', () => {
  let service: StudentService;
  let repository: MockStudentRepository;
  let factory: StudentFactory;

  const validStudentData: StudentCreateData = {
    first_name: 'Juan',
    last_name: 'Pérez',
    second_last_name: 'García',
    birth_date: new Date('2000-05-15'),
    school_name: 'IES Ejemplo'
  };

  beforeEach(() => {
    repository = new MockStudentRepository();
    factory = new StudentFactory();
    service = new StudentService(repository, factory);
  });

  describe('createStudent', () => {
    it('should create a new student successfully', async () => {
      const student = await service.createStudent(validStudentData);

      expect(student.id).toBeDefined();
      expect(student.first_name).toBe('Juan');
      expect(student.last_name).toBe('Pérez');
      expect(student.is_active).toBe(true);
    });

    it('should throw ValidationError for invalid data', async () => {
      const invalidData = { ...validStudentData, first_name: '' };

      await expect(service.createStudent(invalidData))
        .rejects.toThrow(ValidationError);
    });

    it('should throw DuplicateStudentError for duplicate student', async () => {
      await service.createStudent(validStudentData);

      await expect(service.createStudent(validStudentData))
        .rejects.toThrow(DuplicateStudentError);
    });

    it('should trim whitespace from input data', async () => {
      const dataWithSpaces = {
        ...validStudentData,
        first_name: '  Juan  ',
        last_name: '  Pérez  '
      };

      const student = await service.createStudent(dataWithSpaces);

      expect(student.first_name).toBe('Juan');
      expect(student.last_name).toBe('Pérez');
    });
  });

  describe('searchStudentsByName', () => {
    beforeEach(async () => {
      await service.createStudent(validStudentData);
      await service.createStudent({
        ...validStudentData,
        first_name: 'María',
        last_name: 'López',
        birth_date: new Date('1999-03-20')
      });
      await service.createStudent({
        ...validStudentData,
        first_name: 'Juan Carlos',
        last_name: 'Pérez',
        birth_date: new Date('2001-08-10')
      });
    });

    it('should find students by first and last name', async () => {
      const students = await service.searchStudentsByName('Juan', 'Pérez');

      expect(students).toHaveLength(2);
      expect(students.every(s => s.first_name.includes('Juan'))).toBe(true);
      expect(students.every(s => s.last_name.includes('Pérez'))).toBe(true);
    });

    it('should find students by partial name match', async () => {
      const students = await service.searchStudentsByName('Ju', 'Pé');

      expect(students.length).toBeGreaterThan(0);
    });

    it('should throw error when no search parameters provided', async () => {
      await expect(service.searchStudentsByName('', ''))
        .rejects.toThrow('At least one search parameter');
    });

    it('should handle search with only first name', async () => {
      const students = await service.searchStudentsByName('María', '');

      expect(students).toHaveLength(1);
      expect(students[0].first_name).toBe('María');
    });
  });

  describe('updateStudent', () => {
    it('should update student successfully', async () => {
      const created = await service.createStudent(validStudentData);

      const updated = await service.updateStudent(created.id!, {
        first_name: 'Carlos',
        school_name: 'IES Nuevo'
      });

      expect(updated.first_name).toBe('Carlos');
      expect(updated.school_name).toBe('IES Nuevo');
      expect(updated.last_name).toBe('Pérez'); // Unchanged
    });

    it('should throw StudentNotFoundError when student does not exist', async () => {
      await expect(service.updateStudent(999, { first_name: 'Carlos' }))
        .rejects.toThrow(StudentNotFoundError);
    });

    it('should validate updated data', async () => {
      const created = await service.createStudent(validStudentData);

      await expect(service.updateStudent(created.id!, { first_name: '' }))
        .rejects.toThrow();
    });
  });

  describe('getStudentById', () => {
    it('should return student when found', async () => {
      const created = await service.createStudent(validStudentData);

      const found = await service.getStudentById(created.id!);

      expect(found.id).toBe(created.id);
      expect(found.first_name).toBe('Juan');
    });

    it('should throw StudentNotFoundError when not found', async () => {
      await expect(service.getStudentById(999))
        .rejects.toThrow(StudentNotFoundError);
    });
  });

  describe('deleteStudent', () => {
    it('should soft delete student successfully', async () => {
      const created = await service.createStudent(validStudentData);

      await service.deleteStudent(created.id!);

      const student = await repository.findById(created.id!);
      expect(student!.is_active).toBe(false);
      expect(student!.withdrawal_date).toBeDefined();
    });

    it('should throw StudentNotFoundError when student does not exist', async () => {
      await expect(service.deleteStudent(999))
        .rejects.toThrow(StudentNotFoundError);
    });

    it('should throw StudentAlreadyInactiveError when already inactive', async () => {
      const created = await service.createStudent(validStudentData);
      await service.deleteStudent(created.id!);

      await expect(service.deleteStudent(created.id!))
        .rejects.toThrow(StudentAlreadyInactiveError);
    });
  });

  describe('getAllStudents', () => {
    it('should return all students including inactive', async () => {
      await service.createStudent(validStudentData);
      const student2 = await service.createStudent({
        ...validStudentData,
        first_name: 'María',
        birth_date: new Date('1999-03-20')
      });
      await service.deleteStudent(student2.id!);

      const allStudents = await service.getAllStudents();

      expect(allStudents).toHaveLength(2);
    });
  });

  describe('getActiveStudents', () => {
    it('should return only active students', async () => {
      await service.createStudent(validStudentData);
      const student2 = await service.createStudent({
        ...validStudentData,
        first_name: 'María',
        birth_date: new Date('1999-03-20')
      });
      await service.deleteStudent(student2.id!);

      const activeStudents = await service.getActiveStudents();

      expect(activeStudents).toHaveLength(1);
      expect(activeStudents.every(s => s.is_active)).toBe(true);
    });
  });

  describe('reactivateStudent', () => {
    it('should reactivate an inactive student', async () => {
      const created = await service.createStudent(validStudentData);
      await service.deleteStudent(created.id!);

      const reactivated = await service.reactivateStudent(created.id!);

      expect(reactivated.is_active).toBe(true);
      // Note: withdrawal_date might still be set depending on implementation
      // The important thing is that is_active is true
    });

    it('should return student unchanged if already active', async () => {
      const created = await service.createStudent(validStudentData);

      const result = await service.reactivateStudent(created.id!);

      expect(result.is_active).toBe(true);
    });

    it('should throw StudentNotFoundError when student does not exist', async () => {
      await expect(service.reactivateStudent(999))
        .rejects.toThrow(StudentNotFoundError);
    });
  });

  describe('getStudentStatistics', () => {
    it('should return correct statistics', async () => {
      await service.createStudent(validStudentData);
      const student2 = await service.createStudent({
        ...validStudentData,
        first_name: 'María',
        birth_date: new Date('1999-03-20')
      });
      await service.createStudent({
        ...validStudentData,
        first_name: 'Carlos',
        birth_date: new Date('2001-08-10')
      });
      await service.deleteStudent(student2.id!);

      const stats = await service.getStudentStatistics();

      expect(stats.total).toBe(3);
      expect(stats.active).toBe(2);
      expect(stats.inactive).toBe(1);
    });
  });
});