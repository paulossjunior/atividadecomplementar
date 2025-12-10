// Core data interfaces for the Student Data Collection System

export interface Student {
  id: string;           // Unique student ID
  name: string;         // Full name
  email: string;        // Valid email address
  activities: string[]; // Array of activity IDs
  registeredAt: Date;   // Registration timestamp
}

export interface Activity {
  id: string;          // Unique activity ID
  name: string;        // Activity name
  description: string; // Activity description
  createdAt: Date;     // Creation timestamp
  studentCount: number; // Number of registered students
}

export interface StudentFormData {
  name: string;
  email: string;
  studentId: string;
  selectedActivities: string[];
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Form state types
export interface FormState {
  data: StudentFormData;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Search and filter types
export interface SearchFilters {
  query: string;
  activityId?: string;
}

// API response types for data operations
export interface DataResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Utility types for component props
export type StudentListProps = {
  students: Student[];
  activities: Activity[];
  onSearch?: (filters: SearchFilters) => void;
};

export type ActivityManagerProps = {
  activities: Activity[];
  onActivityChange: (activities: Activity[]) => void;
};

export type StudentFormProps = {
  activities: Activity[];
  onSubmit: (data: StudentFormData) => Promise<DataResponse<Student>>;
  initialData?: Partial<StudentFormData>;
};