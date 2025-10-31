import { BaseValidator } from './BaseValidator';
import { RequiredFieldRule } from './rules/RequiredFieldRule';
import { MaxLengthRule } from './rules/MaxLengthRule';
import { DateRangeRule } from './rules/DateRangeRule';
import { DateComparisonRule } from './rules/DateComparisonRule';
import { StudentData } from '../models/Student';

export class StudentValidator extends BaseValidator<StudentData> {
  constructor() {
    super();
    this.setupRules();
  }

  private setupRules(): void {
    // Campos obligatorios
    this.addRule(new RequiredFieldRule(
      'first_name',
      'El nombre es obligatorio',
      (data) => data.first_name
    ));

    this.addRule(new RequiredFieldRule(
      'last_name',
      'El apellido es obligatorio',
      (data) => data.last_name
    ));

    this.addRule(new RequiredFieldRule(
      'birth_date',
      'La fecha de nacimiento es obligatoria',
      (data) => data.birth_date
    ));

    this.addRule(new RequiredFieldRule(
      'school_name',
      'El nombre del centro educativo es obligatorio',
      (data) => data.school_name
    ));

    // Longitudes máximas
    this.addRule(new MaxLengthRule(
      'first_name',
      100,
      'El nombre no puede exceder 100 caracteres',
      (data) => data.first_name
    ));

    this.addRule(new MaxLengthRule(
      'last_name',
      100,
      'El apellido no puede exceder 100 caracteres',
      (data) => data.last_name
    ));

    this.addRule(new MaxLengthRule(
      'second_last_name',
      100,
      'El segundo apellido no puede exceder 100 caracteres',
      (data) => data.second_last_name
    ));

    this.addRule(new MaxLengthRule(
      'school_name',
      150,
      'El nombre del centro educativo no puede exceder 150 caracteres',
      (data) => data.school_name
    ));

    // Validación de rango de fechas de nacimiento
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());

    this.addRule(new DateRangeRule(
      'birth_date',
      minDate,
      maxDate,
      'El estudiante debe tener entre 5 y 100 años',
      (data) => data.birth_date
    ));

    // Validación de fechas de inscripción y baja
    this.addRule(new DateComparisonRule(
      (data) => data.enrollment_date,
      (data) => data.withdrawal_date,
      'La fecha de baja no puede ser anterior a la fecha de inscripción',
      'before'
    ));
  }
}