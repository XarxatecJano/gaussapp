import { StudentValidator } from '../../src/validation/StudentValidator';
import { StudentData } from '../../src/models/Student';

describe('StudentValidator', () => {
  let validator: StudentValidator;

  const validData: StudentData = {
    first_name: 'Juan',
    last_name: 'Pérez',
    second_last_name: 'García',
    birth_date: new Date('2000-05-15'),
    school_name: 'IES Ejemplo'
  };

  beforeEach(() => {
    validator = new StudentValidator();
  });

  describe('Required Fields', () => {
    it('should pass validation with all required fields', () => {
      const result = validator.validate(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when first_name is missing', () => {
      const data = { ...validData, first_name: '' };
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El nombre es obligatorio');
    });

    it('should fail when last_name is missing', () => {
      const data = { ...validData, last_name: '' };
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El apellido es obligatorio');
    });

    it('should fail when school_name is missing', () => {
      const data = { ...validData, school_name: '' };
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El nombre del centro educativo es obligatorio');
    });
  });

  describe('Field Length Validation', () => {
    it('should fail when first_name exceeds 100 characters', () => {
      const data = { ...validData, first_name: 'a'.repeat(101) };
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El nombre no puede exceder 100 caracteres');
    });

    it('should fail when school_name exceeds 150 characters', () => {
      const data = { ...validData, school_name: 'a'.repeat(151) };
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El nombre del centro educativo no puede exceder 150 caracteres');
    });
  });

  describe('Age Validation', () => {
    it('should fail when student is too young (under 5 years)', () => {
      const tooRecentDate = new Date();
      tooRecentDate.setFullYear(tooRecentDate.getFullYear() - 3);
      const data = { ...validData, birth_date: tooRecentDate };
      
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El estudiante debe tener entre 5 y 100 años');
    });

    it('should fail when student is too old (over 100 years)', () => {
      const tooOldDate = new Date();
      tooOldDate.setFullYear(tooOldDate.getFullYear() - 101);
      const data = { ...validData, birth_date: tooOldDate };
      
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El estudiante debe tener entre 5 y 100 años');
    });
  });

  describe('Date Comparison Validation', () => {
    it('should fail when withdrawal_date is before enrollment_date', () => {
      const enrollmentDate = new Date('2020-09-01');
      const withdrawalDate = new Date('2020-08-01');
      const data = {
        ...validData,
        enrollment_date: enrollmentDate,
        withdrawal_date: withdrawalDate
      };
      
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La fecha de baja no puede ser anterior a la fecha de inscripción');
    });

    it('should pass when withdrawal_date is after enrollment_date', () => {
      const enrollmentDate = new Date('2020-09-01');
      const withdrawalDate = new Date('2020-12-01');
      const data = {
        ...validData,
        enrollment_date: enrollmentDate,
        withdrawal_date: withdrawalDate
      };
      
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Multiple Errors', () => {
    it('should collect all validation errors', () => {
      const data = {
        ...validData,
        first_name: '',
        last_name: 'a'.repeat(101),
        school_name: ''
      };
      
      const result = validator.validate(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('El nombre es obligatorio');
      expect(result.errors).toContain('El apellido no puede exceder 100 caracteres');
      expect(result.errors).toContain('El nombre del centro educativo es obligatorio');
    });
  });
});