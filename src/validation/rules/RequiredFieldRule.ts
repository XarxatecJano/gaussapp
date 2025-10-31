import { ValidationRule, ValidationResult } from '../interfaces';

export class RequiredFieldRule<T> implements ValidationRule<T> {
  constructor(
    private fieldName: keyof T,
    private errorMessage: string,
    private getter: (data: T) => any
  ) {}

  validate(data: T): ValidationResult {
    const value = this.getter(data);
    const isEmpty = value === undefined || value === null || 
                   (typeof value === 'string' && value.trim() === '');

    return {
      isValid: !isEmpty,
      errors: isEmpty ? [this.errorMessage] : []
    };
  }
}