import { ValidationRule, ValidationResult } from '../interfaces';

export class DateComparisonRule<T> implements ValidationRule<T> {
  constructor(
    private firstDateGetter: (data: T) => Date | undefined,
    private secondDateGetter: (data: T) => Date | undefined,
    private errorMessage: string,
    private comparison: 'before' | 'after' | 'equal'
  ) {}

  validate(data: T): ValidationResult {
    const firstDate = this.firstDateGetter(data);
    const secondDate = this.secondDateGetter(data);
    
    // Si alguna fecha no existe, la validación pasa
    if (!firstDate || !secondDate) {
      return { isValid: true, errors: [] };
    }

    let isValid = false;
    
    switch (this.comparison) {
      case 'before':
        isValid = firstDate < secondDate;
        break;
      case 'after':
        isValid = firstDate > secondDate;
        break;
      case 'equal':
        isValid = firstDate.getTime() === secondDate.getTime();
        break;
    }

    return {
      isValid,
      errors: isValid ? [] : [this.errorMessage]
    };
  }
}