import { ValidationRule, ValidationResult } from '../interfaces';

export class MaxLengthRule<T> implements ValidationRule<T> {
  constructor(
    private fieldName: keyof T,
    private maxLength: number,
    private errorMessage: string,
    private getter: (data: T) => string | undefined
  ) {}

  validate(data: T): ValidationResult {
    const value = this.getter(data);
    
    if (!value) {
      return { isValid: true, errors: [] };
    }

    const isValid = value.length <= this.maxLength;

    return {
      isValid,
      errors: isValid ? [] : [this.errorMessage]
    };
  }
}