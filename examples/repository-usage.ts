import { pool } from '../src/config/database';
import { RepositoryFactory } from '../src/repositories/RepositoryFactory';
import { StudentFactory } from '../src/factories/StudentFactory';

async function demonstrateRepository() {
  console.log('🗄️  Demonstrating StudentRepository Usage\n');

  try {
    // 1. Crear factory y repository
    const repositoryFactory = new RepositoryFactory(pool);
    const studentRepository = repositoryFactory.getStudentRepository();
    const studentFactory = new StudentFactory();

    // 2. Crear un nuevo estudiante
    console.log('📝 Creating new student...');
    const newStudent = studentFactory.createFromFormData({
      first_name: 'Ana',
      last_name: 'Martínez',
      second_last_name: 'López',
      birth_date: new Date('1999-03-20'),
      school_name: 'IES Repository Demo'
    });

    const createdStudent = await studentRepository.create(newStudent);
    console.log(`✅ Student created with ID: ${createdStudent.id}`);
    console.log(`   Name: ${createdStudent.getFullName()}`);
    console.log(`   Age: ${createdStudent.getAge()}\n`);

    // 3. Buscar estudiante por ID
    console.log('🔍 Finding student by ID...');
    const foundStudent = await studentRepository.findById(createdStudent.id!);
    if (foundStudent) {
      console.log(`✅ Found: ${foundStudent.getFullName()}`);
    } else {
      console.log('❌ Student not found');
    }

    // 4. Buscar por nombre
    console.log('\n🔍 Searching by name pattern...');
    const studentsByName = await studentRepository.findByName('Ana', 'Martínez');
    console.log(`✅ Found ${studentsByName.length} students matching "Ana Martínez"`);
    studentsByName.forEach(s => console.log(`   - ${s.getFullName()}`));

    // 5. Listar estudiantes activos
    console.log('\n📋 Listing active students...');
    const activeStudents = await studentRepository.findActiveStudents();
    console.log(`✅ Found ${activeStudents.length} active students`);
    activeStudents.slice(0, 3).forEach(s => 
      console.log(`   - ${s.getFullName()} (${s.school_name})`)
    );

    // 6. Actualizar estudiante
    console.log('\n🔄 Updating student...');
    const updatedStudent = await studentRepository.update(createdStudent.id!, {
      school_name: 'IES Updated School',
      first_name: 'Ana María'
    });
    
    if (updatedStudent) {
      console.log(`✅ Updated: ${updatedStudent.getFullName()}`);
      console.log(`   New school: ${updatedStudent.school_name}`);
    }

    // 7. Métodos adicionales
    console.log('\n📊 Additional repository methods...');
    
    const studentCount = await studentRepository.countActiveStudents();
    console.log(`✅ Total active students: ${studentCount}`);

    const schoolStudents = await studentRepository.findBySchool('IES Updated');
    console.log(`✅ Students in schools matching "IES Updated": ${schoolStudents.length}`);

    const youngStudents = await studentRepository.findByAgeRange(18, 25);
    console.log(`✅ Students aged 18-25: ${youngStudents.length}`);

    // 8. Soft delete (eliminación lógica)
    console.log('\n🗑️  Soft deleting student...');
    const softDeleted = await studentRepository.softDelete(createdStudent.id!);
    if (softDeleted) {
      console.log('✅ Student marked as inactive');
      
      // Verificar que ya no aparece en activos
      const activeAfterDelete = await studentRepository.findActiveStudents();
      const stillActive = activeAfterDelete.find(s => s.id === createdStudent.id);
      console.log(`   Still in active list: ${stillActive ? 'Yes' : 'No'}`);
    }

    // 9. Cleanup - eliminar permanentemente para el demo
    console.log('\n🧹 Cleaning up demo data...');
    await studentRepository.delete(createdStudent.id!);
    console.log('✅ Demo student permanently deleted');

  } catch (error) {
    console.error('❌ Repository demo error:', error);
  } finally {
    await pool.end();
    console.log('\n🎉 Repository demonstration completed!');
  }
}

// Ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  demonstrateRepository().catch(console.error);
}

export { demonstrateRepository };