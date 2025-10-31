import { Student, StudentCreateData, StudentUpdateData } from '../../src/models/Student';
import { StudentValidator } from '../../src/validation/StudentValidator';
import { StudentFactory } from '../../src/factories/StudentFactory';
import { DatabaseStudentSerializer } from '../../src/serializers/DatabaseStudentSerializer';
import { ApiStudentSerializer } from '../../src/serializers/ApiStudentSerializer';
import { ValidationError } from '../../src/validation/ValidationError';

describe('Student Model (Refactored)', () => {
  let validator: StudentValidator;
  let factory: StudentFactory;
  let dbSerializer: DatabaseStudentSerializer;
  let apiSerializer: ApiStudentSerializer;

  const validStudentData = {
    first_name: 'Juan',
    last_name: 'Pérez',
    second_last_name: 'García',
    birth_date: new Date('2000-05-15'),
    school_name: 'IES Ejemplo'
  };

  beforeEach(() => {
    validator = new StudentValidator();
    factory = new StudentFactory(validator);
    dbSerializer = new DatabaseStudentSerializer();
    apiSerializer = new ApiStudentSerializer();
  });

  describe('Constructor and Validation', () => {
    it('should create a valid student with validator', () => {
      const student = new Student(validStudentData, validator);
      
      expect(student.first_name).toBe('Juan');
      expect(student.last_name).toBe('Pérez');
      expect(student.second_last_name).toBe('García');
      expect(student.birth_date).toEqual(new Date('2000-05-15'));
      expect(student.school_name).toBe('IES Ejemplo');
      expect(student.is_active).toBe(true);
      expect(student.enrollment_date).toBeInstanceOf(Date);
    });

    it('should create student without validator (for database data)', () => {
      const student = new Student(validStudentData);
      expect(student.first_name).toBe('Juan');
    });

    it('should throw ValidationError when first_name is missing', () => {
      const data = { ...validStudentData, first_name: '' };
      
      expect(() => new Student(data, validator)).toThrow(ValidationError);
      expect(() => new Student(data, validator)).toThrow('El nombre es obligatorio');
    });

    it('should throw ValidationError when last_name is missing', () => {
      const data = { ...validStudentData, last_name: '' };
      
      expect(() => new Student(data, validator)).toThrow(ValidationError);
    });

    it('should throw ValidationError when birth_date is missing', () => {
      const data = { ...validStudentData };
      delete (data as any).birth_date;
      
      expect(() => new Student(data as any, validator)).toThrow(ValidationError);
    });

    it('should throw ValidationError when school_name is missing', () => {
      const data = { ...validStudentData, school_name: '' };
      
      expect(() => new Student(data, validator)).toThrow(ValidationError);
    });

    it('should throw ValidationError for field length violations', () => {
      const data = { ...validStudentData, first_name: 'a'.repeat(101) };
      
      expect(() => new Student(data, validator)).toThrow(ValidationError);
      expect(() => new Student(data, validator)).toThrow('El nombre no puede exceder 100 caracteres');
    });

    it('should throw ValidationError for invalid age', () => {
      const tooRecentDate = new Date();
      tooRecentDate.setFullYear(tooRecentDate.getFullYear() - 3);
      const data = { ...validStudentData, birth_date: tooRecentDate };
      
      expect(() => new Student(data, validator)).toThrow(ValidationError);
    });
  });

  describe('Factory Methods', () => {
    it('should create student from form data using factory', () => {
      const createData: StudentCreateData = {
        first_name: '  Juan  ',
        last_name: '  Pérez  ',
        second_last_name: '  García  ',
        birth_date: new Date('2000-05-15'),
        school_name: '  IES Ejemplo  '
      };
      
      const student = factory.createFromFormData(createData);
      
      expect(student.first_name).toBe('Juan');
      expect(student.last_name).toBe('Pérez');
      expect(student.second_last_name).toBe('García');
      expect(student.school_name).toBe('IES Ejemplo');
    });

    it('should create student from database using factory', () => {
      const dbRow = {
        id: 1,
        first_name: 'Juan',
        last_name: 'Pérez',
        second_last_name: 'García',
        birth_date: '2000-05-15',
        school_name: 'IES Ejemplo',
        enrollment_date: '2020-09-01',
        withdrawal_date: null,
        is_active: true
      };
      
      const student = factory.createFromDatabase(dbRow);
      
      expect(student.id).toBe(1);
      expect(student.first_name).toBe('Juan');
      expect(student.birth_date).toEqual(new Date('2000-05-15'));
    });
  });

  describe('Domain Methods', () => {
    let student: Student;

    beforeEach(() => {
      student = new Student(validStudentData, validator);
    });

    describe('getFullName', () => {
      it('should return full name with all parts', () => {
        expect(student.getFullName()).toBe('Juan Pérez García');
      });

      it('should return full name without second_last_name', () => {
        const data = { ...validStudentData };
        const { second_last_name, ...dataWithoutSecondName } = data;
        const studentWithoutSecondName = new Student(dataWithoutSecondName, validator);
        
        expect(studentWithoutSecondName.getFullName()).toBe('Juan Pérez');
      });
    });

    describe('getAge', () => {
      it('should calculate correct age', () => {
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 20);
        const studentWithAge = new Student({
          ...validStudentData,
          birth_date: birthDate
        }, validator);
        
        expect(studentWithAge.getAge()).toBe(20);
      });
    });

    describe('withdraw', () => {
      it('should mark student as inactive and set withdrawal_date', () => {
        student.withdraw();
        
        expect(student.is_active).toBe(false);
        expect(student.withdrawal_date).toBeInstanceOf(Date);
      });
    });

    describe('reactivate', () => {
      it('should mark student as active and clear withdrawal_date', () => {
        student.withdraw();
        student.reactivate();
        
        expect(student.is_active).toBe(true);
        expect(student.withdrawal_date).toBeUndefined();
      });
    });

    describe('update', () => {
      it('should return new student instance with updated data', () => {
        const updateData: StudentUpdateData = { first_name: 'Carlos' };
        const updatedStudent = student.update(updateData, validator);
        
        // Original student unchanged (immutability)
        expect(student.first_name).toBe('Juan');
        
        // New student has updated data
        expect(updatedStudent.first_name).toBe('Carlos');
        expect(updatedStudent.last_name).toBe('Pérez'); // Other fields preserved
      });

      it('should validate updated data', () => {
        const updateData: StudentUpdateData = { first_name: '' };
        
        expect(() => student.update(updateData, validator)).toThrow(ValidationError);
      });
    });
  });

  describe('Serialization', () => {
    let student: Student;

    beforeEach(() => {
      student = new Student({
        id: 1,
        ...validStudentData,
        enrollment_date: new Date('2020-09-01'),
        is_active: true
      });
    });

    describe('Database Serialization', () => {
      it('should serialize for database with all fields', () => {
        const dbData = dbSerializer.serialize(student);
        
        expect(dbData).toEqual({
          id: 1,
          first_name: 'Juan',
          last_name: 'Pérez',
          second_last_name: 'García',
          birth_date: new Date('2000-05-15'),
          school_name: 'IES Ejemplo',
          enrollment_date: new Date('2020-09-01'),
          withdrawal_date: null,
          is_active: true
        });
      });

      it('should handle null values correctly', () => {
        const studentWithoutSecondName = new Student({
          ...validStudentData,
          second_last_name: undefined
        });
        const dbData = dbSerializer.serialize(studentWithoutSecondName);
        
        expect(dbData.second_last_name).toBeNull();
        expect(dbData.withdrawal_date).toBeNull();
      });

      it('should deserialize from database row', () => {
        const dbRow = {
          id: 1,
          first_name: 'Juan',
          last_name: 'Pérez',
          second_last_name: 'García',
          birth_date: '2000-05-15',
          school_name: 'IES Ejemplo',
          enrollment_date: '2020-09-01',
          withdrawal_date: null,
          is_active: true
        };
        
        const studentData = dbSerializer.deserialize(dbRow);
        
        expect(studentData.id).toBe(1);
        expect(studentData.first_name).toBe('Juan');
        expect(studentData.birth_date).toEqual(new Date('2000-05-15'));
        expect(studentData.withdrawal_date).toBeUndefined();
      });
    });

    describe('API Serialization', () => {
      it('should serialize for API with calculated fields', () => {
        const apiData = apiSerializer.serialize(student);
        
        expect(apiData).toEqual({
          id: 1,
          first_name: 'Juan',
          last_name: 'Pérez',
          second_last_name: 'García',
          full_name: 'Juan Pérez García',
          birth_date: '2000-05-15',
          age: expect.any(Number),
          school_name: 'IES Ejemplo',
          enrollment_date: '2020-09-01T00:00:00.000Z',
          withdrawal_date: undefined,
          is_active: true
        });
      });
    });
  });
});