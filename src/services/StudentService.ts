import { 
  IStudentService, 
  StudentNotFoundError, 
  StudentAlreadyInactiveError,
  DuplicateStudentError 
} from './interfaces';
import { IStudentRepository } from '../repositories/interfaces';
import { Student, StudentCreateData, StudentUpdateData } from '../models/Student';
import { StudentFactory } from '../factories/StudentFactory';
import { ValidationError } from '../validation/ValidationError';

export class StudentService implements IStudentService {
  constructor(
    private repository: IStudentRepository,
    private factory: StudentFactory
  ) {}

  /**
   * Historia 1: Dar de alta un alumno mediante formulario web
   * Valida los datos y crea un nuevo estudiante en el sistema
   */
  async createStudent(data: StudentCreateData): Promise<Student> {
    try {
      // Validar y crear el estudiante usando el factory
      const student = this.factory.createFromFormData(data);

      // Verificar si ya existe un estudiante con los mismos datos
      const existingStudents = await this.repository.findByName(
        data.first_name,
        data.last_name
      );

      const duplicate = existingStudents.find(s => 
        s.birth_date.toISOString().split('T')[0] === 
        new Date(data.birth_date).toISOString().split('T')[0]
      );

      if (duplicate) {
        throw new DuplicateStudentError(
          data.first_name,
          data.last_name,
          new Date(data.birth_date)
        );
      }

      // Persistir en la base de datos
      return await this.repository.create(student);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; // Re-lanzar errores de validación
      }
      if (error instanceof DuplicateStudentError) {
        throw error; // Re-lanzar errores de duplicado
      }
      throw new Error(`Failed to create student: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Historia 2: Buscar estudiantes por nombre y apellidos
   * Permite búsqueda parcial para facilitar la localización
   */
  async searchStudentsByName(firstName: string, lastName: string): Promise<Student[]> {
    if (!firstName?.trim() && !lastName?.trim()) {
      throw new Error('At least one search parameter (first name or last name) is required');
    }

    const searchFirstName = firstName?.trim() || '';
    const searchLastName = lastName?.trim() || '';

    return await this.repository.findByName(searchFirstName, searchLastName);
  }

  /**
   * Historia 2: Actualizar datos de un alumno
   * Valida los nuevos datos y actualiza el estudiante
   */
  async updateStudent(id: number, data: StudentUpdateData): Promise<Student> {
    // Verificar que el estudiante existe
    const existingStudent = await this.repository.findById(id);
    if (!existingStudent) {
      throw new StudentNotFoundError(id);
    }

    // Actualizar usando el repository (que usa el método inmutable de Student)
    const updatedStudent = await this.repository.update(id, data);
    
    if (!updatedStudent) {
      throw new StudentNotFoundError(id);
    }

    return updatedStudent;
  }

  /**
   * Obtener un estudiante por su ID
   */
  async getStudentById(id: number): Promise<Student> {
    const student = await this.repository.findById(id);
    
    if (!student) {
      throw new StudentNotFoundError(id);
    }

    return student;
  }

  /**
   * Historia 3: Eliminar un alumno (eliminación lógica)
   * Marca al estudiante como inactivo en lugar de eliminarlo permanentemente
   */
  async deleteStudent(id: number): Promise<void> {
    const student = await this.repository.findById(id);
    
    if (!student) {
      throw new StudentNotFoundError(id);
    }

    if (!student.is_active) {
      throw new StudentAlreadyInactiveError(id);
    }

    const deleted = await this.repository.softDelete(id);
    
    if (!deleted) {
      throw new Error(`Failed to delete student with id ${id}`);
    }
  }

  /**
   * Obtener todos los estudiantes (activos e inactivos)
   */
  async getAllStudents(): Promise<Student[]> {
    return await this.repository.findAll();
  }

  /**
   * Obtener solo estudiantes activos
   */
  async getActiveStudents(): Promise<Student[]> {
    return await this.repository.findActiveStudents();
  }

  /**
   * Reactivar un estudiante previamente dado de baja
   */
  async reactivateStudent(id: number): Promise<Student> {
    const student = await this.repository.findById(id);
    
    if (!student) {
      throw new StudentNotFoundError(id);
    }

    if (student.is_active) {
      return student; // Ya está activo, no hacer nada
    }

    // Reactivar el estudiante
    const updatedStudent = await this.repository.update(id, {
      is_active: true,
      withdrawal_date: undefined
    });

    if (!updatedStudent) {
      throw new StudentNotFoundError(id);
    }

    return updatedStudent;
  }

  /**
   * Obtener estadísticas de estudiantes
   */
  async getStudentStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const allStudents = await this.repository.findAll();
    const activeStudents = allStudents.filter(s => s.is_active);
    
    return {
      total: allStudents.length,
      active: activeStudents.length,
      inactive: allStudents.length - activeStudents.length
    };
  }

  /**
   * Buscar estudiantes por centro educativo
   */
  async getStudentsBySchool(schoolName: string): Promise<Student[]> {
    if (!schoolName?.trim()) {
      throw new Error('School name is required');
    }

    return await this.repository.findBySchool(schoolName.trim());
  }

  /**
   * Buscar estudiantes por rango de edad
   */
  async getStudentsByAgeRange(minAge: number, maxAge: number): Promise<Student[]> {
    if (minAge < 0 || maxAge < 0) {
      throw new Error('Age values must be positive');
    }

    if (minAge > maxAge) {
      throw new Error('Minimum age cannot be greater than maximum age');
    }

    return await this.repository.findByAgeRange(minAge, maxAge);
  }
}