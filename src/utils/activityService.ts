import type { Activity, DataResponse, ValidationResult } from '../types';
import { validateActivity } from './validation';
import { 
  getAllActivities, 
  getActivityById, 
  addActivity, 
  updateActivity, 
  deleteActivity,
  getStudentsByActivity
} from './dataManager';

export class ActivityService {
  
  // Get all activities
  static getAll(): Activity[] {
    return getAllActivities();
  }

  // Get activity by ID
  static getById(id: string): Activity | undefined {
    return getActivityById(id);
  }

  // Get activities with student counts updated
  static getAllWithCounts(): Activity[] {
    const activities = this.getAll();
    return activities.map(activity => ({
      ...activity,
      studentCount: getStudentsByActivity(activity.id).length
    }));
  }

  // Validate activity data
  static validateActivity(name: string, description: string): ValidationResult {
    return validateActivity(name, description);
  }

  // Check if activity name is available
  static isNameAvailable(name: string, excludeId?: string): boolean {
    const activities = this.getAll();
    const normalizedName = name.toLowerCase().trim();
    
    return !activities.some(activity => 
      activity.id !== excludeId && 
      activity.name.toLowerCase() === normalizedName
    );
  }

  // Create new activity
  static async create(name: string, description: string): Promise<DataResponse<Activity>> {
    // Validate activity data
    const validation = this.validateActivity(name, description);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.map(e => e.message).join(', ')
      };
    }

    // Check if name is available
    if (!this.isNameAvailable(name)) {
      return {
        success: false,
        error: 'Já existe uma atividade com este nome'
      };
    }

    return addActivity(name, description);
  }

  // Update existing activity
  static async update(id: string, name?: string, description?: string): Promise<DataResponse<Activity>> {
    const existingActivity = this.getById(id);
    if (!existingActivity) {
      return {
        success: false,
        error: 'Atividade não encontrada'
      };
    }

    const updates: Partial<Activity> = {};

    // Validate and update name if provided
    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length < 3) {
        return {
          success: false,
          error: 'Nome da atividade deve ter pelo menos 3 caracteres'
        };
      }
      
      if (!this.isNameAvailable(trimmedName, id)) {
        return {
          success: false,
          error: 'Já existe uma atividade com este nome'
        };
      }
      
      updates.name = trimmedName;
    }

    // Validate and update description if provided
    if (description !== undefined) {
      const trimmedDescription = description.trim();
      if (trimmedDescription.length < 10) {
        return {
          success: false,
          error: 'Descrição deve ter pelo menos 10 caracteres'
        };
      }
      
      updates.description = trimmedDescription;
    }

    return updateActivity(id, updates);
  }

  // Delete activity
  static async delete(id: string): Promise<DataResponse<boolean>> {
    const activity = this.getById(id);
    if (!activity) {
      return {
        success: false,
        error: 'Atividade não encontrada'
      };
    }

    // Check if activity has students
    const studentsInActivity = getStudentsByActivity(id);
    if (studentsInActivity.length > 0) {
      return {
        success: false,
        error: `Não é possível excluir a atividade. ${studentsInActivity.length} estudante(s) estão inscritos nesta atividade.`
      };
    }

    return deleteActivity(id);
  }

  // Force delete activity (removes from all students)
  static async forceDelete(id: string): Promise<DataResponse<boolean>> {
    const activity = this.getById(id);
    if (!activity) {
      return {
        success: false,
        error: 'Atividade não encontrada'
      };
    }

    return deleteActivity(id);
  }

  // Get activity statistics
  static getActivityStats() {
    const activities = this.getAllWithCounts();
    
    if (activities.length === 0) {
      return {
        total: 0,
        totalStudentEnrollments: 0,
        averageStudentsPerActivity: 0,
        mostPopularActivity: null,
        leastPopularActivity: null,
        emptyActivities: 0
      };
    }

    const totalStudentEnrollments = activities.reduce((sum, activity) => sum + activity.studentCount, 0);
    const averageStudentsPerActivity = totalStudentEnrollments / activities.length;
    
    const sortedByPopularity = [...activities].sort((a, b) => b.studentCount - a.studentCount);
    const mostPopularActivity = sortedByPopularity[0];
    const leastPopularActivity = sortedByPopularity[sortedByPopularity.length - 1];
    
    const emptyActivities = activities.filter(activity => activity.studentCount === 0).length;

    return {
      total: activities.length,
      totalStudentEnrollments,
      averageStudentsPerActivity: Math.round(averageStudentsPerActivity * 100) / 100,
      mostPopularActivity,
      leastPopularActivity,
      emptyActivities
    };
  }

  // Get students enrolled in activity
  static getEnrolledStudents(activityId: string) {
    return getStudentsByActivity(activityId);
  }

  // Search activities by name or description
  static search(query: string): Activity[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return this.getAll();
    
    const activities = this.getAll();
    return activities.filter(activity => 
      activity.name.toLowerCase().includes(searchTerm) ||
      activity.description.toLowerCase().includes(searchTerm)
    );
  }

  // Get popular activities (sorted by student count)
  static getPopularActivities(limit: number = 5): Activity[] {
    const activities = this.getAllWithCounts();
    return activities
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, limit);
  }

  // Get recent activities
  static getRecentActivities(limit: number = 5): Activity[] {
    const activities = this.getAll();
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Export activities data
  static exportData(): Array<{
    id: string;
    name: string;
    description: string;
    studentCount: number;
    createdAt: string;
  }> {
    const activities = this.getAllWithCounts();
    
    return activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      studentCount: activity.studentCount,
      createdAt: activity.createdAt.toLocaleDateString('pt-BR')
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
        errors.push(`Erro ao deletar atividade ${id}: ${result.error}`);
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