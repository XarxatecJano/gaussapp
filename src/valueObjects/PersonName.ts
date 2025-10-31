export class PersonName {
  constructor(
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly secondLastName?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.firstName?.trim()) {
      throw new Error('First name is required');
    }
    if (!this.lastName?.trim()) {
      throw new Error('Last name is required');
    }
  }

  getFullName(): string {
    const names = [this.firstName, this.lastName];
    if (this.secondLastName) {
      names.push(this.secondLastName);
    }
    return names.join(' ');
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getSecondLastName(): string | undefined {
    return this.secondLastName;
  }

  equals(other: PersonName): boolean {
    return this.firstName === other.firstName &&
           this.lastName === other.lastName &&
           this.secondLastName === other.secondLastName;
  }
}