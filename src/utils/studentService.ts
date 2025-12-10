import type { Student, StudentFormData, DataResponse, ValidationResult } from '../types';
import { validateStudentForm, validateEmail, validateStudentId } from './validation';
import { 
  getAllStudents, 
  getStudentById, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  searchStudents,
  getStudentsByActivity,
  getExistingStudentIds,
  getExistingEmails
} from './dataManager';

export class StudentService {
  
  // Get all students
  static getAll(): Student[] {
    return getAllStudents();
  }

  // Get student by ID
  static getById(id: string): Student | undefined {
    return getStudentById(id);
  }

  // Search students by query
  static search(query: string): Student[] {
    return searchStudents(query);
  }

  // Get students by activity
  static getByActivity(activityId: string): Student[] {
    return getStudentsByActivity(activityId);
  }

  // Validate student form data
  static validateForm(data: StudentFormData): ValidationResult {
    const existingIds = getExistingStudentIds();
    return validateStudentForm(data, existingIds);
  }

  // Check if student ID is available
  static isIdAvailable(id: string): boolean {
    if (!validateStudentId(id)) {
      return false;
    }
    return !getExistingStudentIds().includes(id);
  }

  // Check if email is available
  static isEmailAvailable(email: string): boolean {
    if (!validateEmail(email)) {
      return false;
    }
    return !getExistingEmails().includes(email);
  }

  // Create new student
  static async create(formData: StudentFormData): Promise<DataResponse<Student>> {
    // Validate form data
    const validation = this.validateForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.map(e => e.message).join(', ')
      };
    }

    // Create student object
    const studentData: Omit<Student, 'registeredAt'> = {
      id: formData.studentId,
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      activities: formData.selectedActivities
    };

    return addStudent(studentData);
  }

  // Update existing student
  static async update(id: string, updates: Partial<StudentFormData>): Promise<DataResponse<Student>> {
    const existingStudent = this.getById(id);
    if (!existingStudent) {
      return {
        success: false,
        error: 'Estudante não encontrado'
      };
    }

    // Prepare update data
    const updateData: Partial<Student> = {};
    
    if (updates.name !== undefined) {
      updateData.name = updates.name.trim();
    }
    
    if (updates.email !== undefined) {
      const email = updates.email.toLowerCase().trim();
      if (email !== existingStudent.email && !this.isEmailAvailable(email)) {
        return {
          success: false,
          error: 'Email já está em uso'
        };
      }
      updateData.email = email;
    }
    
    if (updates.selectedActivities !== undefined) {
      updateData.activities = updates.selectedActivities;
    }

    return updateStudent(id, updateData);
  }

  // Delete student
  static async delete(id: string): Promise<DataResponse<boolean>> {
    return deleteStudent(id);
  }

  // Get student statistics
  static getStudentStats() {
    const students = this.getAll();
    
    if (students.length === 0) {
      return {
        total: 0,
        averageActivities: 0,
        mostActiveStudent: null,
        recentRegistrations: []
      };
    }

    const totalActivities = students.reduce((sum, student) => sum + student.activities.length, 0);
    const averageActivities = totalActivities / students.length;
    
    const mostActiveStudent = students.reduce((prev, current) => 
      current.activities.length > prev.activities.length ? current : prev
    );

    const recentRegistrations = students
      .sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime())
      .slice(0, 5);

    return {
      total: students.length,
      averageActivities: Math.round(averageActivities * 100) / 100,
      mostActiveStudent,
      recentRegistrations
    };
  }

  // Export students data (for CSV export)
  static exportData(): Array<{
    id: string;
    name: string;
    email: string;
    activities: string;
    registeredAt: string;
  }> {
    const students = this.getAll();
    
    return students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      activities: student.activities.join(', '),
      registeredAt: student.registeredAt.toLocaleDateString('pt-BR')
    }));
  }

  // Bulk operations
  static async bulkDelete(ids: string[]): Promise<DataResponse<number>> {
    let deletedCount = 0;
    const errors: string[] = [];

    for (const id of ids) {
      const result = await this.delete(id);
      if (result.success) {
        deletedCount++;
      } else {
        errors.push(`Erro ao deletar ${id}: ${result.error}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join('; ')
      };
    }

    return {
      success: true,
      data: deletedCount
    };
  }
}