export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule<T> {
  validate(data: T): ValidationResult;
}

export interface IValidator<T> {
  validate(data: T): ValidationResult;
}