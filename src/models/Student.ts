import { IValidator } from '../validation/interfaces';
import { ValidationError } from '../validation/ValidationError';
import { PersonName } from '../valueObjects/PersonName';
import { Age } from '../valueObjects/Age';

export interface StudentData {
  id?: number;
  first_name: string;
  last_name: string;
  second_last_name?: string;
  birth_date: Date;
  school_name: string;
  enrollment_date?: Date;
  withdrawal_date?: Date;
  is_active?: boolean;
}

export interface StudentCreateData {
  first_name: string;
  last_name: string;
  second_last_name?: string;
  birth_date: Date;
  school_name: string;
}

export interface StudentUpdateData {
  first_name?: string;
  last_name?: string;
  second_last_name?: string;
  birth_date?: Date;
  school_name?: string;
  withdrawal_date?: Date;
  is_active?: boolean;
}

export class Student {
  public readonly id?: number;
  public readonly first_name: string;
  public readonly last_name: string;
  public readonly second_last_name?: string;
  public readonly birth_date: Date;
  public readonly school_name: string;
  public readonly enrollment_date: Date;
  public withdrawal_date?: Date;
  public is_active: boolean;

  private readonly name: PersonName;
  private readonly age: Age;

  constructor(data: StudentData, validator?: IValidator<StudentData>) {
    // Validar datos si se proporciona un validador
    if (validator) {
      const validationResult = validator.validate(data);
      if (!validationResult.isValid) {
        throw new ValidationError(validationResult.errors);
      }
    }

    // Asignar propiedades
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.second_last_name = data.second_last_name;
    this.birth_date = data.birth_date;
    this.school_name = data.school_name;
    this.enrollment_date = data.enrollment_date || new Date();
    this.withdrawal_date = data.withdrawal_date;
    this.is_active = data.is_active ?? true;

    // Crear value objects
    this.name = new PersonName(this.first_name, this.last_name, this.second_last_name);
    this.age = new Age(this.birth_date);
  }

  // Método para obtener el nombre completo
  public getFullName(): string {
    return this.name.getFullName();
  }

  // Método para calcular la edad
  public getAge(): number {
    return this.age.getValue();
  }

  // Método para marcar como dado de baja
  public withdraw(): void {
    this.is_active = false;
    this.withdrawal_date = new Date();
  }

  // Método para reactivar
  public reactivate(): void {
    this.is_active = true;
    this.withdrawal_date = undefined;
  }



  // Actualizar con datos parciales - retorna nueva instancia (inmutabilidad)
  public update(data: StudentUpdateData, validator?: IValidator<StudentData>): Student {
    const updatedData: StudentData = {
      id: this.id,
      first_name: data.first_name !== undefined ? data.first_name.trim() : this.first_name,
      last_name: data.last_name !== undefined ? data.last_name.trim() : this.last_name,
      second_last_name: data.second_last_name !== undefined ? data.second_last_name?.trim() : this.second_last_name,
      birth_date: data.birth_date !== undefined ? new Date(data.birth_date) : this.birth_date,
      school_name: data.school_name !== undefined ? data.school_name.trim() : this.school_name,
      enrollment_date: this.enrollment_date,
      withdrawal_date: data.withdrawal_date !== undefined ? 
        (data.withdrawal_date ? new Date(data.withdrawal_date) : undefined) : this.withdrawal_date,
      is_active: data.is_active !== undefined ? data.is_active : this.is_active
    };

    return new Student(updatedData, validator);
  }
}