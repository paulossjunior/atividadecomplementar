import type { StudentFormData, ValidationResult, ValidationError, Activity } from '../types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Student ID validation (alphanumeric, 6-12 characters)
const STUDENT_ID_REGEX = /^[a-zA-Z0-9]{6,12}$/;

export function validateStudentForm(
  data: StudentFormData, 
  existingStudentIds: string[] = []
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate name
  if (!data.name || data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Nome deve ter pelo menos 2 caracteres'
    });
  }

  // Validate email
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    errors.push({
      field: 'email',
      message: 'Email deve ter um formato válido'
    });
  }

  // Validate student ID
  if (!data.studentId || !STUDENT_ID_REGEX.test(data.studentId)) {
    errors.push({
      field: 'studentId',
      message: 'ID do estudante deve ter 6-12 caracteres alfanuméricos'
    });
  } else if (existingStudentIds.includes(data.studentId)) {
    errors.push({
      field: 'studentId',
      message: 'Este ID de estudante já está em uso'
    });
  }

  // Validate activities selection
  if (!data.selectedActivities || data.selectedActivities.length === 0) {
    errors.push({
      field: 'selectedActivities',
      message: 'Selecione pelo menos uma atividade'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateActivity(name: string, description: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length < 3) {
    errors.push({
      field: 'name',
      message: 'Nome da atividade deve ter pelo menos 3 caracteres'
    });
  }

  if (!description || description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Descrição deve ter pelo menos 10 caracteres'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateStudentId(id: string): boolean {
  return STUDENT_ID_REGEX.test(id);
}