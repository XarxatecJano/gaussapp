import { Pool } from 'pg';
import { StudentService } from './StudentService';
import { RepositoryFactory } from '../repositories/RepositoryFactory';
import { StudentFactory } from '../factories/StudentFactory';
import { StudentValidator } from '../validation/StudentValidator';

export class ServiceFactory {
  private studentService?: StudentService;
  private repositoryFactory: RepositoryFactory;

  constructor(pool: Pool) {
    this.repositoryFactory = new RepositoryFactory(pool);
  }

  getStudentService(): StudentService {
    if (!this.studentService) {
      const repository = this.repositoryFactory.getStudentRepository();
      const validator = new StudentValidator();
      const factory = new StudentFactory(validator);

      this.studentService = new StudentService(repository, factory);
    }

    return this.studentService;
  }

  // Método para crear servicio con dependencias personalizadas (útil para testing)
  createStudentService(
    repository: any,
    factory: StudentFactory
  ): StudentService {
    return new StudentService(repository, factory);
  }
}