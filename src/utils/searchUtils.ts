import type { Student, Activity, SearchFilters } from '../types';

export class SearchUtils {
  
  // Advanced search for students
  static searchStudents(
    students: Student[], 
    query: string, 
    options: {
      fields?: ('name' | 'email' | 'id')[];
      caseSensitive?: boolean;
      exactMatch?: boolean;
      minLength?: number;
    } = {}
  ): Student[] {
    
    const {
      fields = ['name', 'email', 'id'],
      caseSensitive = false,
      exactMatch = false,
      minLength = 1
    } = options;

    // Return all students if query is too short
    if (!query || query.trim().length < minLength) {
      return students;
    }

    const searchTerm = caseSensitive ? query.trim() : query.trim().toLowerCase();
    
    return students.filter(student => {
      return fields.some(field => {
        const fieldValue = caseSensitive ? student[field] : student[field].toLowerCase();
        
        if (exactMatch) {
          return fieldValue === searchTerm;
        } else {
          return fieldValue.includes(searchTerm);
        }
      });
    });
  }

  // Filter students by activity
  static filterByActivity(students: Student[], activityId: string): Student[] {
    if (!activityId) return students;
    
    return students.filter(student => 
      student.activities.includes(activityId)
    );
  }

  // Filter students by multiple activities (AND logic)
  static filterByActivities(students: Student[], activityIds: string[]): Student[] {
    if (!activityIds || activityIds.length === 0) return students;
    
    return students.filter(student => 
      activityIds.every(activityId => student.activities.includes(activityId))
    );
  }

  // Filter students by date range
  static filterByDateRange(
    students: Student[], 
    startDate?: Date, 
    endDate?: Date
  ): Student[] {
    return students.filter(student => {
      const registrationDate = new Date(student.registeredAt);
      
      if (startDate && registrationDate < startDate) {
        return false;
      }
      
      if (endDate && registrationDate > endDate) {
        return false;
      }
      
      return true;
    });
  }

  // Combined search and filter
  static searchAndFilter(
    students: Student[], 
    filters: SearchFilters & {
      activityIds?: string[];
      startDate?: Date;
      endDate?: Date;
      searchOptions?: {
        fields?: ('name' | 'email' | 'id')[];
        caseSensitive?: boolean;
        exactMatch?: boolean;
      };
    }
  ): Student[] {
    
    let result = students;

    // Apply text search
    if (filters.query) {
      result = this.searchStudents(result, filters.query, filters.searchOptions);
    }

    // Apply single activity filter
    if (filters.activityId) {
      result = this.filterByActivity(result, filters.activityId);
    }

    // Apply multiple activities filter
    if (filters.activityIds && filters.activityIds.length > 0) {
      result = this.filterByActivities(result, filters.activityIds);
    }

    // Apply date range filter
    if (filters.startDate || filters.endDate) {
      result = this.filterByDateRange(result, filters.startDate, filters.endDate);
    }

    return result;
  }

  // Search activities
  static searchActivities(
    activities: Activity[], 
    query: string,
    options: {
      fields?: ('name' | 'description')[];
      caseSensitive?: boolean;
      minLength?: number;
    } = {}
  ): Activity[] {
    
    const {
      fields = ['name', 'description'],
      caseSensitive = false,
      minLength = 1
    } = options;

    if (!query || query.trim().length < minLength) {
      return activities;
    }

    const searchTerm = caseSensitive ? query.trim() : query.trim().toLowerCase();
    
    return activities.filter(activity => {
      return fields.some(field => {
        const fieldValue = caseSensitive ? activity[field] : activity[field].toLowerCase();
        return fieldValue.includes(searchTerm);
      });
    });
  }

  // Sort students
  static sortStudents(
    students: Student[], 
    sortBy: 'name' | 'email' | 'id' | 'registeredAt' | 'activityCount',
    direction: 'asc' | 'desc' = 'asc'
  ): Student[] {
    
    return [...students].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'id':
          aValue = a.id.toLowerCase();
          bValue = b.id.toLowerCase();
          break;
        case 'registeredAt':
          aValue = new Date(a.registeredAt).getTime();
          bValue = new Date(b.registeredAt).getTime();
          break;
        case 'activityCount':
          aValue = a.activities.length;
          bValue = b.activities.length;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Sort activities
  static sortActivities(
    activities: Activity[], 
    sortBy: 'name' | 'createdAt' | 'studentCount',
    direction: 'asc' | 'desc' = 'asc'
  ): Activity[] {
    
    return [...activities].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'studentCount':
          aValue = a.studentCount;
          bValue = b.studentCount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Get search suggestions
  static getSearchSuggestions(
    students: Student[], 
    query: string, 
    maxSuggestions: number = 5
  ): string[] {
    
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const suggestions = new Set<string>();

    students.forEach(student => {
      // Add name suggestions
      if (student.name.toLowerCase().includes(searchTerm)) {
        suggestions.add(student.name);
      }

      // Add email suggestions
      if (student.email.toLowerCase().includes(searchTerm)) {
        suggestions.add(student.email);
      }

      // Add ID suggestions
      if (student.id.toLowerCase().includes(searchTerm)) {
        suggestions.add(student.id);
      }
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  // Highlight search terms in text
  static highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Get filter statistics
  static getFilterStats(
    allStudents: Student[], 
    filteredStudents: Student[]
  ): {
    total: number;
    filtered: number;
    percentage: number;
    hidden: number;
  } {
    
    const total = allStudents.length;
    const filtered = filteredStudents.length;
    const hidden = total - filtered;
    const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0;

    return {
      total,
      filtered,
      percentage,
      hidden
    };
  }

  // Create search index for faster searching
  static createSearchIndex(students: Student[]): Map<string, Student[]> {
    const index = new Map<string, Student[]>();

    students.forEach(student => {
      // Index by name words
      const nameWords = student.name.toLowerCase().split(/\s+/);
      nameWords.forEach(word => {
        if (word.length >= 2) {
          if (!index.has(word)) {
            index.set(word, []);
          }
          index.get(word)!.push(student);
        }
      });

      // Index by email
      const email = student.email.toLowerCase();
      if (!index.has(email)) {
        index.set(email, []);
      }
      index.get(email)!.push(student);

      // Index by ID
      const id = student.id.toLowerCase();
      if (!index.has(id)) {
        index.set(id, []);
      }
      index.get(id)!.push(student);
    });

    return index;
  }

  // Search using index for better performance
  static searchWithIndex(
    searchIndex: Map<string, Student[]>, 
    query: string
  ): Student[] {
    
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results = new Set<Student>();

    // Direct match
    if (searchIndex.has(searchTerm)) {
      searchIndex.get(searchTerm)!.forEach(student => results.add(student));
    }

    // Partial matches
    for (const [key, students] of searchIndex.entries()) {
      if (key.includes(searchTerm)) {
        students.forEach(student => results.add(student));
      }
    }

    return Array.from(results);
  }
}