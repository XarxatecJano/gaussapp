import { PersonName } from '../../src/valueObjects/PersonName';

describe('PersonName', () => {
  describe('Constructor', () => {
    it('should create PersonName with all parts', () => {
      const name = new PersonName('Juan', 'Pérez', 'García');
      
      expect(name.getFirstName()).toBe('Juan');
      expect(name.getLastName()).toBe('Pérez');
      expect(name.getSecondLastName()).toBe('García');
    });

    it('should create PersonName without second last name', () => {
      const name = new PersonName('Juan', 'Pérez');
      
      expect(name.getFirstName()).toBe('Juan');
      expect(name.getLastName()).toBe('Pérez');
      expect(name.getSecondLastName()).toBeUndefined();
    });

    it('should throw error when first name is empty', () => {
      expect(() => new PersonName('', 'Pérez')).toThrow('First name is required');
    });

    it('should throw error when last name is empty', () => {
      expect(() => new PersonName('Juan', '')).toThrow('Last name is required');
    });
  });

  describe('getFullName', () => {
    it('should return full name with all parts', () => {
      const name = new PersonName('Juan', 'Pérez', 'García');
      expect(name.getFullName()).toBe('Juan Pérez García');
    });

    it('should return full name without second last name', () => {
      const name = new PersonName('Juan', 'Pérez');
      expect(name.getFullName()).toBe('Juan Pérez');
    });
  });

  describe('equals', () => {
    it('should return true for identical names', () => {
      const name1 = new PersonName('Juan', 'Pérez', 'García');
      const name2 = new PersonName('Juan', 'Pérez', 'García');
      
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = new PersonName('Juan', 'Pérez', 'García');
      const name2 = new PersonName('Carlos', 'Pérez', 'García');
      
      expect(name1.equals(name2)).toBe(false);
    });

    it('should handle undefined second last name correctly', () => {
      const name1 = new PersonName('Juan', 'Pérez');
      const name2 = new PersonName('Juan', 'Pérez');
      
      expect(name1.equals(name2)).toBe(true);
    });
  });
});