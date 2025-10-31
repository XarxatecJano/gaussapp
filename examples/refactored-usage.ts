import {
  StudentFactory,
  StudentValidator,
  DatabaseStudentSerializer,
  ApiStudentSerializer,
  ValidationError
} from '../src/index.refactored';

// Ejemplo de uso del sistema refactorizado
async function demonstrateRefactoredSystem() {
  console.log('🚀 Demonstrating Refactored Student Management System\n');

  // 1. Crear instancias de los componentes
  const validator = new StudentValidator();
  const factory = new StudentFactory(validator);
  const dbSerializer = new DatabaseStudentSerializer();
  const apiSerializer = new ApiStudentSerializer();

  // 2. Crear un estudiante desde datos de formulario
  console.log('📝 Creating student from form data...');
  try {
    const student = factory.createFromFormData({
      first_name: '  Juan  ',
      last_name: '  Pérez  ',
      second_last_name: '  García  ',
      birth_date: new Date('2000-05-15'),
      school_name: '  IES Ejemplo  '
    });

    console.log('✅ Student created successfully');
    console.log(`   Full name: ${student.getFullName()}`);
    console.log(`   Age: ${student.getAge()}`);
    console.log(`   Active: ${student.is_active}\n`);

    // 3. Serializar para base de datos
    console.log('💾 Serializing for database...');
    const dbData = dbSerializer.serialize(student);
    console.log('✅ Database serialization:', JSON.stringify(dbData, null, 2));

    // 4. Serializar para API
    console.log('\n🌐 Serializing for API...');
    const apiData = apiSerializer.serialize(student);
    console.log('✅ API serialization:', JSON.stringify(apiData, null, 2));

    // 5. Actualizar estudiante (inmutable)
    console.log('\n🔄 Updating student (immutable)...');
    const updatedStudent = student.update({
      first_name: 'Carlos',
      school_name: 'IES Nuevo Centro'
    }, validator);

    console.log('✅ Student updated successfully');
    console.log(`   Original name: ${student.getFullName()}`);
    console.log(`   Updated name: ${updatedStudent.getFullName()}`);
    console.log(`   Updated school: ${updatedStudent.school_name}\n`);

    // 6. Gestión de estado
    console.log('🔄 Managing student state...');
    updatedStudent.withdraw();
    console.log(`   After withdrawal - Active: ${updatedStudent.is_active}`);
    console.log(`   Withdrawal date: ${updatedStudent.withdrawal_date}`);

    updatedStudent.reactivate();
    console.log(`   After reactivation - Active: ${updatedStudent.is_active}`);
    console.log(`   Withdrawal date: ${updatedStudent.withdrawal_date}\n`);

  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('❌ Validation failed:', error.errors);
    } else {
      console.log('❌ Unexpected error:', error);
    }
  }

  // 7. Demostrar validación de errores
  console.log('🚫 Demonstrating validation errors...');
  try {
    factory.createFromFormData({
      first_name: '', // Error: required field
      last_name: 'a'.repeat(101), // Error: too long
      birth_date: new Date('2022-01-01'), // Error: too young
      school_name: 'Valid School'
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('✅ Validation correctly caught errors:');
      error.errors.forEach(err => console.log(`   - ${err}`));
    }
  }

  console.log('\n🎉 Refactored system demonstration completed!');
}

// Ejecutar la demostración si este archivo se ejecuta directamente
if (require.main === module) {
  demonstrateRefactoredSystem().catch(console.error);
}

export { demonstrateRefactoredSystem };