import type { Student, Activity, DataResponse } from '../types';

// Import data files
import studentsData from '../data/students.json';
import activitiesData from '../data/activities.json';

// In-memory storage for the static site
let students: Student[] = studentsData.map(student => ({
  ...student,
  registeredAt: new Date(student.registeredAt)
}));

let activities: Activity[] = activitiesData.map(activity => ({
  ...activity,
  createdAt: new Date(activity.createdAt)
}));

// Student management functions
export function getAllStudents(): Student[] {
  return [...students];
}

export function getStudentById(id: string): Student | undefined {
  return students.find(student => student.id === id);
}

export function getStudentsByActivity(activityId: string): Student[] {
  return students.filter(student => student.activities.includes(activityId));
}

export function searchStudents(query: string): Student[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return getAllStudents();
  
  return students.filter(student => 
    student.name.toLowerCase().includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm) ||
    student.id.toLowerCase().includes(searchTerm)
  );
}

export function addStudent(studentData: Omit<Student, 'registeredAt'>): DataResponse<Student> {
  try {
    // Check for duplicate ID
    if (students.some(s => s.id === studentData.id)) {
      return {
        success: false,
        error: 'ID de estudante já existe'
      };
    }

    // Check for duplicate email
    if (students.some(s => s.email === studentData.email)) {
      return {
        success: false,
        error: 'Email já está em uso'
      };
    }

    const newStudent: Student = {
      ...studentData,
      registeredAt: new Date()
    };

    students.push(newStudent);
    
    // Update activity student counts
    studentData.activities.forEach(activityId => {
      updateActivityStudentCount(activityId);
    });

    return {
      success: true,
      data: newStudent
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao adicionar estudante'
    };
  }
}

export function updateStudent(id: string, updates: Partial<Student>): DataResponse<Student> {
  try {
    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      return {
        success: false,
        error: 'Estudante não encontrado'
      };
    }

    const oldStudent = students[studentIndex];
    const updatedStudent = { ...oldStudent, ...updates };
    
    students[studentIndex] = updatedStudent;

    // Update activity counts if activities changed
    if (updates.activities) {
      // Remove from old activities
      oldStudent.activities.forEach(activityId => {
        if (!updates.activities!.includes(activityId)) {
          updateActivityStudentCount(activityId);
        }
      });
      
      // Add to new activities
      updates.activities.forEach(activityId => {
        if (!oldStudent.activities.includes(activityId)) {
          updateActivityStudentCount(activityId);
        }
      });
    }

    return {
      success: true,
      data: updatedStudent
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao atualizar estudante'
    };
  }
}

export function deleteStudent(id: string): DataResponse<boolean> {
  try {
    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      return {
        success: false,
        error: 'Estudante não encontrado'
      };
    }

    const student = students[studentIndex];
    students.splice(studentIndex, 1);

    // Update activity student counts
    student.activities.forEach(activityId => {
      updateActivityStudentCount(activityId);
    });

    return {
      success: true,
      data: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao remover estudante'
    };
  }
}

// Activity management functions
export function getAllActivities(): Activity[] {
  return [...activities];
}

export function getActivityById(id: string): Activity | undefined {
  return activities.find(activity => activity.id === id);
}

export function addActivity(name: string, description: string): DataResponse<Activity> {
  try {
    // Check for duplicate name
    if (activities.some(a => a.name.toLowerCase() === name.toLowerCase())) {
      return {
        success: false,
        error: 'Já existe uma atividade com este nome'
      };
    }

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date(),
      studentCount: 0
    };

    activities.push(newActivity);

    return {
      success: true,
      data: newActivity
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao criar atividade'
    };
  }
}

export function updateActivity(id: string, updates: Partial<Activity>): DataResponse<Activity> {
  try {
    const activityIndex = activities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      return {
        success: false,
        error: 'Atividade não encontrada'
      };
    }

    // Check for duplicate name if name is being updated
    if (updates.name) {
      const existingActivity = activities.find(a => 
        a.id !== id && a.name.toLowerCase() === updates.name!.toLowerCase()
      );
      if (existingActivity) {
        return {
          success: false,
          error: 'Já existe uma atividade com este nome'
        };
      }
    }

    const updatedActivity = { ...activities[activityIndex], ...updates };
    activities[activityIndex] = updatedActivity;

    return {
      success: true,
      data: updatedActivity
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao atualizar atividade'
    };
  }
}

export function deleteActivity(id: string): DataResponse<boolean> {
  try {
    const activityIndex = activities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      return {
        success: false,
        error: 'Atividade não encontrada'
      };
    }

    // Remove activity from all students
    students.forEach(student => {
      student.activities = student.activities.filter(actId => actId !== id);
    });

    activities.splice(activityIndex, 1);

    return {
      success: true,
      data: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao remover atividade'
    };
  }
}

// Utility functions
function updateActivityStudentCount(activityId: string): void {
  const activity = activities.find(a => a.id === activityId);
  if (activity) {
    activity.studentCount = students.filter(s => s.activities.includes(activityId)).length;
  }
}

export function getExistingStudentIds(): string[] {
  return students.map(student => student.id);
}

export function getExistingEmails(): string[] {
  return students.map(student => student.email);
}

// Statistics functions
export function getStatistics() {
  return {
    totalStudents: students.length,
    totalActivities: activities.length,
    averageActivitiesPerStudent: students.length > 0 
      ? students.reduce((sum, student) => sum + student.activities.length, 0) / students.length 
      : 0,
    mostPopularActivity: activities.length > 0 
      ? activities.reduce((prev, current) => 
          current.studentCount > prev.studentCount ? current : prev
        )
      : null
  };
}