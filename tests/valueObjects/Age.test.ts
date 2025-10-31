import { Age } from '../../src/valueObjects/Age';

describe('Age', () => {
  describe('Constructor', () => {
    it('should create Age with valid birth date', () => {
      const birthDate = new Date('2000-05-15');
      const age = new Age(birthDate);
      
      expect(age.getBirthDate()).toEqual(birthDate);
    });

    it('should throw error when birth date is in the future', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      expect(() => new Age(futureDate)).toThrow('Birth date cannot be in the future');
    });
  });

  describe('getValue', () => {
    it('should calculate correct age', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      const age = new Age(birthDate);
      
      expect(age.getValue()).toBe(25);
    });

    it('should handle birthday not yet reached this year', () => {
      const today = new Date();
      const birthDate = new Date(today);
      birthDate.setFullYear(today.getFullYear() - 25);
      birthDate.setMonth(today.getMonth() + 1); // Next month
      
      const age = new Age(birthDate);
      
      expect(age.getValue()).toBe(24);
    });

    it('should handle exact birthday', () => {
      const today = new Date();
      const birthDate = new Date(today);
      birthDate.setFullYear(today.getFullYear() - 25);
      
      const age = new Age(birthDate);
      
      expect(age.getValue()).toBe(25);
    });
  });

  describe('equals', () => {
    it('should return true for same birth dates', () => {
      const birthDate = new Date('2000-05-15');
      const age1 = new Age(birthDate);
      const age2 = new Age(new Date('2000-05-15'));
      
      expect(age1.equals(age2)).toBe(true);
    });

    it('should return false for different birth dates', () => {
      const age1 = new Age(new Date('2000-05-15'));
      const age2 = new Age(new Date('2000-05-16'));
      
      expect(age1.equals(age2)).toBe(false);
    });
  });

  describe('getBirthDate', () => {
    it('should return a copy of the birth date (immutability)', () => {
      const originalDate = new Date('2000-05-15');
      const age = new Age(originalDate);
      const returnedDate = age.getBirthDate();
      
      // Modify the returned date
      returnedDate.setFullYear(1999);
      
      // Original should be unchanged
      expect(age.getBirthDate().getFullYear()).toBe(2000);
    });
  });
});