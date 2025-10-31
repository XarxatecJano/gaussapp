import { ValidationResult, ValidationRule, IValidator } from './interfaces';

export abstract class BaseValidator<T> implements IValidator<T> {
  protected rules: ValidationRule<T>[] = [];

  protected addRule(rule: ValidationRule<T>): void {
    this.rules.push(rule);
  }

  validate(data: T): ValidationResult {
    const errors: string[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(data);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}