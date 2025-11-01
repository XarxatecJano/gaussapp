// Models
export { Student, StudentData, StudentCreateData, StudentUpdateData } from './models/Student';

// Validation
export { IValidator, ValidationResult, ValidationRule } from './validation/interfaces';
export { ValidationError } from './validation/ValidationError';
export { StudentValidator } from './validation/StudentValidator';

// Value Objects
export { PersonName } from './valueObjects/PersonName';
export { Age } from './valueObjects/Age';

// Serializers
export { ISerializer, IDeserializer } from './serializers/interfaces';
export { DatabaseStudentSerializer, DatabaseRow } from './serializers/DatabaseStudentSerializer';
export { ApiStudentSerializer, ApiStudentResponse } from './serializers/ApiStudentSerializer';

// Factories
export { StudentFactory } from './factories/StudentFactory';

// Repositories
export { IRepository, IStudentRepository } from './repositories/interfaces';
export { StudentRepository } from './repositories/StudentRepository';
export { RepositoryFactory } from './repositories/RepositoryFactory';

// Infrastructure
export { IDatabaseConnection } from './infrastructure/interfaces';
export { PostgreSQLConnection } from './infrastructure/PostgreSQLConnection';