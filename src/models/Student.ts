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
  public id?: number;
  public first_name: string;
  public last_name: string;
  public second_last_name?: string;
  public birth_date: Date;
  public school_name: string;
  public enrollment_date: Date;
  public withdrawal_date?: Date;
  public is_active: boolean;

  constructor(data: StudentData) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.second_last_name = data.second_last_name;
    this.birth_date = data.birth_date;
    this.school_name = data.school_name;
    this.enrollment_date = data.enrollment_date || new Date();
    this.withdrawal_date = data.withdrawal_date;
    this.is_active = data.is_active ?? true;

    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    // Validar campos obligatorios
    if (!this.first_name?.trim()) {
      errors.push('El nombre es obligatorio');
    }

    if (!this.last_name?.trim()) {
      errors.push('El apellido es obligatorio');
    }

    if (!this.birth_date) {
      errors.push('La fecha de nacimiento es obligatoria');
    }

    if (!this.school_name?.trim()) {
      errors.push('El nombre del centro educativo es obligatorio');
    }

    // Validar longitudes
    if (this.first_name && this.first_name.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }

    if (this.last_name && this.last_name.length > 100) {
      errors.push('El apellido no puede exceder 100 caracteres');
    }

    if (this.second_last_name && this.second_last_name.length > 100) {
      errors.push('El segundo apellido no puede exceder 100 caracteres');
    }

    if (this.school_name && this.school_name.length > 150) {
      errors.push('El nombre del centro educativo no puede exceder 150 caracteres');
    }

    // Validar fecha de nacimiento
    if (this.birth_date) {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());

      if (this.birth_date < minDate) {
        errors.push('La fecha de nacimiento no puede ser anterior a 100 años');
      }

      if (this.birth_date > maxDate) {
        errors.push('El estudiante debe tener al menos 5 años');
      }
    }

    // Validar fechas de inscripción y baja
    if (this.withdrawal_date && this.enrollment_date && this.withdrawal_date < this.enrollment_date) {
      errors.push('La fecha de baja no puede ser anterior a la fecha de inscripción');
    }

    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(', ')}`);
    }
  }

  // Método para obtener el nombre completo
  public getFullName(): string {
    const names = [this.first_name, this.last_name];
    if (this.second_last_name) {
      names.push(this.second_last_name);
    }
    return names.join(' ');
  }

  // Método para calcular la edad
  public getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.birth_date.getFullYear();
    const monthDiff = today.getMonth() - this.birth_date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birth_date.getDate())) {
      age--;
    }
    
    return age;
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

  // Serialización para base de datos
  public toDatabase(): Record<string, any> {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      second_last_name: this.second_last_name || null,
      birth_date: this.birth_date,
      school_name: this.school_name,
      enrollment_date: this.enrollment_date,
      withdrawal_date: this.withdrawal_date || null,
      is_active: this.is_active
    };
  }

  // Serialización para API/JSON
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      second_last_name: this.second_last_name,
      full_name: this.getFullName(),
      birth_date: this.birth_date.toISOString().split('T')[0], // YYYY-MM-DD
      age: this.getAge(),
      school_name: this.school_name,
      enrollment_date: this.enrollment_date.toISOString(),
      withdrawal_date: this.withdrawal_date?.toISOString(),
      is_active: this.is_active
    };
  }

  // Deserialización desde base de datos
  public static fromDatabase(row: any): Student {
    return new Student({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      second_last_name: row.second_last_name,
      birth_date: new Date(row.birth_date),
      school_name: row.school_name,
      enrollment_date: new Date(row.enrollment_date),
      withdrawal_date: row.withdrawal_date ? new Date(row.withdrawal_date) : undefined,
      is_active: row.is_active
    });
  }

  // Crear desde datos de formulario/API
  public static fromCreateData(data: StudentCreateData): Student {
    return new Student({
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      second_last_name: data.second_last_name?.trim(),
      birth_date: new Date(data.birth_date),
      school_name: data.school_name.trim()
    });
  }

  // Actualizar con datos parciales
  public update(data: StudentUpdateData): void {
    if (data.first_name !== undefined) {
      this.first_name = data.first_name.trim();
    }
    if (data.last_name !== undefined) {
      this.last_name = data.last_name.trim();
    }
    if (data.second_last_name !== undefined) {
      this.second_last_name = data.second_last_name?.trim();
    }
    if (data.birth_date !== undefined) {
      this.birth_date = new Date(data.birth_date);
    }
    if (data.school_name !== undefined) {
      this.school_name = data.school_name.trim();
    }
    if (data.withdrawal_date !== undefined) {
      this.withdrawal_date = data.withdrawal_date ? new Date(data.withdrawal_date) : undefined;
    }
    if (data.is_active !== undefined) {
      this.is_active = data.is_active;
    }

    // Revalidar después de la actualización
    this.validate();
  }
}