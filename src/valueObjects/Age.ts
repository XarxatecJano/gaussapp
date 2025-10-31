export class Age {
  constructor(private readonly birthDate: Date) {
    this.validate();
  }

  private validate(): void {
    if (!this.birthDate) {
      throw new Error('Birth date is required');
    }
    
    const today = new Date();
    if (this.birthDate > today) {
      throw new Error('Birth date cannot be in the future');
    }
  }

  getValue(): number {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDiff = today.getMonth() - this.birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getBirthDate(): Date {
    return new Date(this.birthDate);
  }

  equals(other: Age): boolean {
    return this.birthDate.getTime() === other.birthDate.getTime();
  }
}