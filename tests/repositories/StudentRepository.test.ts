import { StudentRepository } from '../../src/repositories/StudentRepository';
import { IDatabaseConnection } from '../../src/infrastructure/interfaces';
import { StudentFactory } from '../../src/factories/StudentFactory';
import { DatabaseStudentSerializer } from '../../src/serializers/DatabaseStudentSerializer';
import { Student } from '../../src/models/Student';

// Mock de la conexión de base de datos
class MockDatabaseConnection implements IDatabaseConnection {
  private mockData: any[] = [];
  private nextId = 1;

  setMockData(data: any[]) {
    this.mockData = data;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // Simulación simple para tests
    if (sql.includes('SELECT * FROM student WHERE id')) {
      const id = params?.[0];
      return this.mockData.filter(row => row.id === id) as T[];
    }
    
    if (sql.includes('SELECT * FROM student ORDER BY')) {
      return [...this.mockData] as T[];
    }

    if (sql.includes('SELECT * FROM student') && sql.includes('LOWER(first_name)')) {
      const firstName = params?.[0]?.replace(/%/g, '') || '';
      const lastName = params?.[1]?.replace(/%/g, '') || '';
      return this.mockData.filter(row => 
        row.first_name.toLowerCase().includes(firstName.toLowerCase()) &&
        row.last_name.toLowerCase().includes(lastName.toLowerCase())
      ) as T[];
    }

    if (sql.includes('SELECT * FROM student') && sql.includes('WHERE is_active = true')) {
      return this.mockData.filter(row => row.is_active) as T[];
    }

    if (sql.includes('DELETE FROM student WHERE id')) {
      const id = params?.[0];
      const index = this.mockData.findIndex(row => row.id === id);
      if (index >= 0) {
        this.mockData.splice(index, 1);
        return [{ affected: 1 }] as T[];
      }
      return [] as T[];
    }

    if (sql.includes('UPDATE student SET') && sql.includes('is_active = false')) {
      const id = params?.[0];
      const index = this.mockData.findIndex(row => row.id === id && row.is_active);
      if (index >= 0) {
        this.mockData[index].is_active = false;
        this.mockData[index].withdrawal_date = new Date();
        return [{ affected: 1 }] as T[];
      }
      return [] as T[];
    }

    return [] as T[];
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    if (sql.includes('INSERT INTO student')) {
      const newRow = {
        id: this.nextId++,
        first_name: params?.[0],
        last_name: params?.[1],
        second_last_name: params?.[2],
        birth_date: params?.[3],
        school_name: params?.[4],
        enrollment_date: params?.[5] || new Date(),
        withdrawal_date: params?.[6],
        is_active: params?.[7] ?? true
      };
      this.mockData.push(newRow);
      return newRow as T;
    }

    if (sql.includes('UPDATE student SET')) {
      const id = params?.[0];
      const index = this.mockData.findIndex(row => row.id === id);
      if (index >= 0) {
        this.mockData[index] = {
          ...this.mockData[index],
          first_name: params?.[1],
          last_name: params?.[2],
          second_last_name: params?.[3],
          birth_date: params?.[4],
          school_name: params?.[5],
          enrollment_date: params?.[6],
          withdrawal_date: params?.[7],
          is_active: params?.[8]
        };
        return this.mockData[index] as T;
      }
    }

    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async beginTransaction(): Promise<void> {}
  async commit(): Promise<void> {}
  async rollback(): Promise<void> {}
}

describe('StudentRepository', () => {
  let repository: StudentRepository;
  let mockDb: MockDatabaseConnection;
  let factory: StudentFactory;
  let serializer: DatabaseStudentSerializer;

  const mockStudentData = {
    id: 1,
    first_name: 'Juan',
    last_name: 'Pérez',
    second_last_name: 'García',
    birth_date: new Date('2000-05-15'),
    school_name: 'IES Ejemplo',
    enrollment_date: new Date('2020-09-01'),
    withdrawal_date: null,
    is_active: true
  };

  beforeEach(() => {
    mockDb = new MockDatabaseConnection();
    factory = new StudentFactory();
    serializer = new DatabaseStudentSerializer();
    repository = new StudentRepository(mockDb, factory, serializer);
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const student = factory.createFromFormData({
        first_name: 'Juan',
        last_name: 'Pérez',
        second_last_name: 'García',
        birth_date: new Date('2000-05-15'),
        school_name: 'IES Ejemplo'
      });

      const createdStudent = await repository.create(student);

      expect(createdStudent.id).toBeDefined();
      expect(createdStudent.first_name).toBe('Juan');
      expect(createdStudent.last_name).toBe('Pérez');
      expect(createdStudent.is_active).toBe(true);
    });
  });

  describe('findById', () => {
    it('should find student by id', async () => {
      mockDb.setMockData([mockStudentData]);

      const student = await repository.findById(1);

      expect(student).not.toBeNull();
      expect(student!.id).toBe(1);
      expect(student!.first_name).toBe('Juan');
    });

    it('should return null when student not found', async () => {
      mockDb.setMockData([]);

      const student = await repository.findById(999);

      expect(student).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      const mockData = [
        mockStudentData,
        { ...mockStudentData, id: 2, first_name: 'María', last_name: 'López' }
      ];
      mockDb.setMockData(mockData);

      const students = await repository.findAll();

      expect(students).toHaveLength(2);
      expect(students[0].first_name).toBe('Juan');
      expect(students[1].first_name).toBe('María');
    });
  });

  describe('findByName', () => {
    it('should find students by name pattern', async () => {
      const mockData = [
        mockStudentData,
        { ...mockStudentData, id: 2, first_name: 'Juan Carlos', last_name: 'Pérez' },
        { ...mockStudentData, id: 3, first_name: 'María', last_name: 'García' }
      ];
      mockDb.setMockData(mockData);

      const students = await repository.findByName('Juan', 'Pérez');

      expect(students).toHaveLength(2);
      expect(students.every(s => s.first_name.includes('Juan'))).toBe(true);
      expect(students.every(s => s.last_name.includes('Pérez'))).toBe(true);
    });
  });

  describe('findActiveStudents', () => {
    it('should return only active students', async () => {
      const mockData = [
        mockStudentData,
        { ...mockStudentData, id: 2, first_name: 'María', is_active: false },
        { ...mockStudentData, id: 3, first_name: 'Carlos', is_active: true }
      ];
      mockDb.setMockData(mockData);

      const students = await repository.findActiveStudents();

      expect(students).toHaveLength(2);
      expect(students.every(s => s.is_active)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update student and return updated instance', async () => {
      mockDb.setMockData([mockStudentData]);

      const updatedStudent = await repository.update(1, {
        first_name: 'Carlos',
        school_name: 'IES Nuevo'
      });

      expect(updatedStudent).not.toBeNull();
      expect(updatedStudent!.first_name).toBe('Carlos');
      expect(updatedStudent!.school_name).toBe('IES Nuevo');
      expect(updatedStudent!.last_name).toBe('Pérez'); // Unchanged
    });

    it('should return null when student not found', async () => {
      mockDb.setMockData([]);

      const result = await repository.update(999, { first_name: 'Carlos' });

      expect(result).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('should mark student as inactive', async () => {
      mockDb.setMockData([mockStudentData]);

      const result = await repository.softDelete(1);

      expect(result).toBe(true);
    });
  });

  describe('delete', () => {
    it('should permanently delete student', async () => {
      mockDb.setMockData([mockStudentData]);

      const result = await repository.delete(1);

      expect(result).toBe(true);
    });
  });
});