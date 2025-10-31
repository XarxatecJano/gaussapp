import { ValidationRule, ValidationResult } from '../interfaces';

export class DateRangeRule<T> implements ValidationRule<T> {
  constructor(
    private fieldName: keyof T,
    private minDate: Date,
    private maxDate: Date,
    private errorMessage: string,
    private getter: (data: T) => Date | undefined
  ) {}

  validate(data: T): ValidationResult {
    const value = this.getter(data);
    
    if (!value) {
      return { isValid: true, errors: [] };
    }

    const isValid = value >= this.minDate && value <= this.maxDate;

    return {
      isValid,
      errors: isValid ? [] : [this.errorMessage]
    };
  }
}