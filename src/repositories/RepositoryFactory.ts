import { Pool } from 'pg';
import { StudentRepository } from './StudentRepository';
import { PostgreSQLConnection } from '../infrastructure/PostgreSQLConnection';
import { StudentFactory } from '../factories/StudentFactory';
import { DatabaseStudentSerializer } from '../serializers/DatabaseStudentSerializer';
import { StudentValidator } from '../validation/StudentValidator';

export class RepositoryFactory {
  private studentRepository?: StudentRepository;

  constructor(private pool: Pool) {}

  getStudentRepository(): StudentRepository {
    if (!this.studentRepository) {
      const dbConnection = new PostgreSQLConnection(this.pool);
      const validator = new StudentValidator();
      const studentFactory = new StudentFactory(validator);
      const serializer = new DatabaseStudentSerializer();

      this.studentRepository = new StudentRepository(
        dbConnection,
        studentFactory,
        serializer
      );
    }

    return this.studentRepository;
  }

  // Método para crear repository con dependencias personalizadas (útil para testing)
  createStudentRepository(
    dbConnection: PostgreSQLConnection,
    studentFactory: StudentFactory,
    serializer: DatabaseStudentSerializer
  ): StudentRepository {
    return new StudentRepository(dbConnection, studentFactory, serializer);
  }
}