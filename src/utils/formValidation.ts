import type { ValidationError, ValidationResult } from '../types';

// Real-time validation utilities for form fields
export class FormValidator {
  
  // Validate individual field
  static validateField(fieldName: string, value: string, options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => string | null;
  } = {}): ValidationError | null {
    
    const { required = false, minLength, maxLength, pattern, customValidator } = options;
    
    // Check if field is required and empty
    if (required && (!value || value.trim().length === 0)) {
      return {
        field: fieldName,
        message: 'Este campo é obrigatório'
      };
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value.trim().length === 0) {
      return null;
    }
    
    const trimmedValue = value.trim();
    
    // Check minimum length
    if (minLength && trimmedValue.length < minLength) {
      return {
        field: fieldName,
        message: `Deve ter pelo menos ${minLength} caracteres`
      };
    }
    
    // Check maximum length
    if (maxLength && trimmedValue.length > maxLength) {
      return {
        field: fieldName,
        message: `Deve ter no máximo ${maxLength} caracteres`
      };
    }
    
    // Check pattern
    if (pattern && !pattern.test(trimmedValue)) {
      return {
        field: fieldName,
        message: 'Formato inválido'
      };
    }
    
    // Run custom validator
    if (customValidator) {
      const customError = customValidator(trimmedValue);
      if (customError) {
        return {
          field: fieldName,
          message: customError
        };
      }
    }
    
    return null;
  }
  
  // Validate name field
  static validateName(name: string): ValidationError | null {
    return this.validateField('name', name, {
      required: true,
      minLength: 2,
      maxLength: 100,
      customValidator: (value) => {
        // Check if name contains only letters, spaces, and common name characters
        const namePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
        if (!namePattern.test(value)) {
          return 'Nome deve conter apenas letras, espaços, hífens e apostrofes';
        }
        
        // Check if name has at least two words
        const words = value.trim().split(/\s+/);
        if (words.length < 2) {
          return 'Digite o nome completo (nome e sobrenome)';
        }
        
        return null;
      }
    });
  }
  
  // Validate email field
  static validateEmail(email: string): ValidationError | null {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return this.validateField('email', email, {
      required: true,
      maxLength: 254, // RFC 5321 limit
      pattern: emailPattern,
      customValidator: (value) => {
        // Additional email validation
        const lowercaseEmail = value.toLowerCase();
        
        // Check for common typos
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const domain = lowercaseEmail.split('@')[1];
        
        if (domain) {
          // Check for common typos in domain
          const typos = {
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com'
          };
          
          if (typos[domain]) {
            return `Você quis dizer ${lowercaseEmail.replace(domain, typos[domain])}?`;
          }
        }
        
        return null;
      }
    });
  }
  
  // Validate student ID field
  static validateStudentId(studentId: string, existingIds: string[] = []): ValidationError | null {
    const idPattern = /^[a-zA-Z0-9]{6,12}$/;
    
    const baseValidation = this.validateField('studentId', studentId, {
      required: true,
      pattern: idPattern,
      customValidator: (value) => {
        if (existingIds.includes(value)) {
          return 'Este ID já está em uso';
        }
        return null;
      }
    });
    
    if (baseValidation) {
      // Customize error message for pattern
      if (baseValidation.message === 'Formato inválido') {
        return {
          field: 'studentId',
          message: 'ID deve ter 6-12 caracteres alfanuméricos (letras e números apenas)'
        };
      }
    }
    
    return baseValidation;
  }
  
  // Validate activity selection
  static validateActivitySelection(selectedActivities: string[]): ValidationError | null {
    if (!selectedActivities || selectedActivities.length === 0) {
      return {
        field: 'selectedActivities',
        message: 'Selecione pelo menos uma atividade'
      };
    }
    
    if (selectedActivities.length > 5) {
      return {
        field: 'selectedActivities',
        message: 'Selecione no máximo 5 atividades'
      };
    }
    
    return null;
  }
  
  // Validate entire form
  static validateStudentForm(formData: {
    name: string;
    email: string;
    studentId: string;
    selectedActivities: string[];
  }, existingIds: string[] = []): ValidationResult {
    
    const errors: ValidationError[] = [];
    
    // Validate each field
    const nameError = this.validateName(formData.name);
    if (nameError) errors.push(nameError);
    
    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.push(emailError);
    
    const idError = this.validateStudentId(formData.studentId, existingIds);
    if (idError) errors.push(idError);
    
    const activitiesError = this.validateActivitySelection(formData.selectedActivities);
    if (activitiesError) errors.push(activitiesError);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Form field enhancement utilities
export class FormFieldEnhancer {
  
  // Add real-time validation to a form field
  static addRealTimeValidation(
    input: HTMLInputElement, 
    validator: (value: string) => ValidationError | null,
    errorElementId: string
  ) {
    const errorElement = document.getElementById(errorElementId);
    
    const validateAndDisplay = () => {
      const error = validator(input.value);
      
      if (error) {
        this.showFieldError(input, errorElement, error.message);
      } else {
        this.clearFieldError(input, errorElement);
      }
    };
    
    // Validate on blur (when user leaves field)
    input.addEventListener('blur', validateAndDisplay);
    
    // Clear error on input (when user starts typing)
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        this.clearFieldError(input, errorElement);
      }
    });
  }
  
  // Show field error
  static showFieldError(input: HTMLInputElement, errorElement: HTMLElement | null, message: string) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement?.id || '');
  }
  
  // Clear field error
  static clearFieldError(input: HTMLInputElement, errorElement: HTMLElement | null) {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
  }
  
  // Add accessibility enhancements
  static enhanceAccessibility(form: HTMLFormElement) {
    // Add ARIA live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'form-announcements';
    form.appendChild(liveRegion);
    
    // Enhance form submission feedback
    form.addEventListener('submit', (event) => {
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.setAttribute('aria-describedby', 'form-announcements');
      }
    });
    
    // Add keyboard navigation improvements
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach((input, index) => {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && input.tagName !== 'TEXTAREA' && input.getAttribute('type') !== 'submit') {
          event.preventDefault();
          const nextInput = inputs[index + 1] as HTMLElement;
          if (nextInput) {
            nextInput.focus();
          }
        }
      });
    });
  }
  
  // Add form auto-save functionality
  static addAutoSave(form: HTMLFormElement, storageKey: string) {
    const saveFormData = () => {
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      
      for (const [key, value] of formData.entries()) {
        if (data[key]) {
          // Handle multiple values (like checkboxes)
          if (Array.isArray(data[key])) {
            data[key].push(value);
          } else {
            data[key] = [data[key], value];
          }
        } else {
          data[key] = value;
        }
      }
      
      localStorage.setItem(storageKey, JSON.stringify(data));
    };
    
    const loadFormData = () => {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          
          Object.entries(data).forEach(([key, value]) => {
            const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input) {
              if (input.type === 'checkbox' || input.type === 'radio') {
                if (Array.isArray(value)) {
                  value.forEach(v => {
                    const checkbox = form.querySelector(`[name="${key}"][value="${v}"]`) as HTMLInputElement;
                    if (checkbox) checkbox.checked = true;
                  });
                } else {
                  input.checked = input.value === value;
                }
              } else {
                input.value = value as string;
              }
            }
          });
        } catch (error) {
          console.warn('Failed to load saved form data:', error);
        }
      }
    };
    
    // Load saved data on page load
    loadFormData();
    
    // Save data on input changes
    form.addEventListener('input', saveFormData);
    form.addEventListener('change', saveFormData);
    
    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
      setTimeout(() => {
        if (form.querySelector('.alert-success')) {
          localStorage.removeItem(storageKey);
        }
      }, 100);
    });
  }
}