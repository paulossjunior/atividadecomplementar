// Integration test utilities to verify system functionality

import { StudentService } from './studentService';
import { ActivityService } from './activityService';
import type { StudentFormData } from '../types';

export class IntegrationTest {
  
  // Test basic system functionality
  static async runBasicTests(): Promise<{ success: boolean; results: string[] }> {
    const results: string[] = [];
    let allTestsPassed = true;

    try {
      // Test 1: Activity Management
      results.push('🧪 Testing Activity Management...');
      
      const activityResult = await ActivityService.create(
        'Test Activity',
        'This is a test activity for integration testing'
      );
      
      if (activityResult.success) {
        results.push('✅ Activity creation: PASSED');
        
        // Test activity retrieval
        const activities = ActivityService.getAll();
        if (activities.length > 0) {
          results.push('✅ Activity retrieval: PASSED');
        } else {
          results.push('❌ Activity retrieval: FAILED');
          allTestsPassed = false;
        }
      } else {
        results.push('❌ Activity creation: FAILED - ' + activityResult.error);
        allTestsPassed = false;
      }

      // Test 2: Student Management
      results.push('🧪 Testing Student Management...');
      
      const testStudentData: StudentFormData = {
        name: 'Test Student',
        email: 'test@example.com',
        studentId: 'TEST001',
        selectedActivities: activityResult.success ? [activityResult.data!.id] : []
      };

      const studentResult = await StudentService.create(testStudentData);
      
      if (studentResult.success) {
        results.push('✅ Student creation: PASSED');
        
        // Test student retrieval
        const students = StudentService.getAll();
        if (students.length > 0) {
          results.push('✅ Student retrieval: PASSED');
        } else {
          results.push('❌ Student retrieval: FAILED');
          allTestsPassed = false;
        }
        
        // Test student search
        const searchResults = StudentService.search('Test');
        if (searchResults.length > 0) {
          results.push('✅ Student search: PASSED');
        } else {
          results.push('❌ Student search: FAILED');
          allTestsPassed = false;
        }
      } else {
        results.push('❌ Student creation: FAILED - ' + studentResult.error);
        allTestsPassed = false;
      }

      // Test 3: Validation
      results.push('🧪 Testing Validation...');
      
      const invalidStudentData: StudentFormData = {
        name: 'A', // Too short
        email: 'invalid-email', // Invalid format
        studentId: '123', // Too short
        selectedActivities: []
      };

      const validationResult = StudentService.validateForm(invalidStudentData);
      if (!validationResult.isValid && validationResult.errors.length > 0) {
        results.push('✅ Form validation: PASSED');
      } else {
        results.push('❌ Form validation: FAILED');
        allTestsPassed = false;
      }

      // Test 4: Data Relationships
      results.push('🧪 Testing Data Relationships...');
      
      if (activityResult.success && studentResult.success) {
        const activityWithCounts = ActivityService.getAllWithCounts();
        const testActivity = activityWithCounts.find(a => a.id === activityResult.data!.id);
        
        if (testActivity && testActivity.studentCount > 0) {
          results.push('✅ Activity-Student relationship: PASSED');
        } else {
          results.push('❌ Activity-Student relationship: FAILED');
          allTestsPassed = false;
        }
      }

      // Cleanup test data
      results.push('🧹 Cleaning up test data...');
      
      if (studentResult.success) {
        await StudentService.delete(studentResult.data!.id);
      }
      
      if (activityResult.success) {
        await ActivityService.forceDelete(activityResult.data!.id);
      }
      
      results.push('✅ Cleanup completed');

    } catch (error) {
      results.push('❌ Unexpected error: ' + (error as Error).message);
      allTestsPassed = false;
    }

    return {
      success: allTestsPassed,
      results
    };
  }

  // Test form validation
  static testFormValidation(): { success: boolean; results: string[] } {
    const results: string[] = [];
    let allTestsPassed = true;

    results.push('🧪 Testing Form Validation...');

    // Test valid data
    const validData: StudentFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      studentId: 'JOHN001',
      selectedActivities: ['act-001']
    };

    const validResult = StudentService.validateForm(validData);
    if (validResult.isValid) {
      results.push('✅ Valid form data: PASSED');
    } else {
      results.push('❌ Valid form data: FAILED');
      allTestsPassed = false;
    }

    // Test invalid name
    const invalidNameData = { ...validData, name: 'A' };
    const nameResult = StudentService.validateForm(invalidNameData);
    if (!nameResult.isValid) {
      results.push('✅ Invalid name validation: PASSED');
    } else {
      results.push('❌ Invalid name validation: FAILED');
      allTestsPassed = false;
    }

    // Test invalid email
    const invalidEmailData = { ...validData, email: 'invalid-email' };
    const emailResult = StudentService.validateForm(invalidEmailData);
    if (!emailResult.isValid) {
      results.push('✅ Invalid email validation: PASSED');
    } else {
      results.push('❌ Invalid email validation: FAILED');
      allTestsPassed = false;
    }

    // Test invalid student ID
    const invalidIdData = { ...validData, studentId: '123' };
    const idResult = StudentService.validateForm(invalidIdData);
    if (!idResult.isValid) {
      results.push('✅ Invalid student ID validation: PASSED');
    } else {
      results.push('❌ Invalid student ID validation: FAILED');
      allTestsPassed = false;
    }

    // Test empty activities
    const noActivitiesData = { ...validData, selectedActivities: [] };
    const activitiesResult = StudentService.validateForm(noActivitiesData);
    if (!activitiesResult.isValid) {
      results.push('✅ Empty activities validation: PASSED');
    } else {
      results.push('❌ Empty activities validation: FAILED');
      allTestsPassed = false;
    }

    return {
      success: allTestsPassed,
      results
    };
  }

  // Test accessibility features
  static testAccessibility(): { success: boolean; results: string[] } {
    const results: string[] = [];
    let allTestsPassed = true;

    results.push('🧪 Testing Accessibility Features...');

    // Check for ARIA live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    if (liveRegions.length > 0) {
      results.push('✅ ARIA live regions: FOUND');
    } else {
      results.push('⚠️ ARIA live regions: NOT FOUND');
    }

    // Check for skip links
    const skipLinks = document.querySelectorAll('.skip-link');
    if (skipLinks.length > 0) {
      results.push('✅ Skip navigation links: FOUND');
    } else {
      results.push('⚠️ Skip navigation links: NOT FOUND');
    }

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      results.push('✅ Heading structure: FOUND');
    } else {
      results.push('⚠️ Heading structure: NOT FOUND');
    }

    // Check for form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    let labelsFound = 0;
    
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) labelsFound++;
      }
    });

    if (inputs.length === 0 || labelsFound === inputs.length) {
      results.push('✅ Form labels: ALL INPUTS LABELED');
    } else {
      results.push(`⚠️ Form labels: ${labelsFound}/${inputs.length} INPUTS LABELED`);
    }

    // Check for focus indicators
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
    if (focusableElements.length > 0) {
      results.push('✅ Focusable elements: FOUND');
    } else {
      results.push('⚠️ Focusable elements: NOT FOUND');
    }

    return {
      success: allTestsPassed,
      results
    };
  }

  // Test responsive design
  static testResponsiveDesign(): { success: boolean; results: string[] } {
    const results: string[] = [];
    let allTestsPassed = true;

    results.push('🧪 Testing Responsive Design...');

    // Check viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      results.push('✅ Viewport meta tag: FOUND');
    } else {
      results.push('❌ Viewport meta tag: NOT FOUND');
      allTestsPassed = false;
    }

    // Check for responsive classes
    const responsiveElements = document.querySelectorAll('[class*="mobile"], [class*="tablet"], [class*="desktop"]');
    if (responsiveElements.length > 0) {
      results.push('✅ Responsive classes: FOUND');
    } else {
      results.push('⚠️ Responsive classes: NOT FOUND');
    }

    // Check for CSS Grid/Flexbox usage
    const gridElements = document.querySelectorAll('[class*="grid"], [class*="flex"]');
    if (gridElements.length > 0) {
      results.push('✅ Modern layout methods: FOUND');
    } else {
      results.push('⚠️ Modern layout methods: NOT FOUND');
    }

    return {
      success: allTestsPassed,
      results
    };
  }

  // Run all tests
  static async runAllTests(): Promise<{ success: boolean; results: string[] }> {
    const allResults: string[] = [];
    let overallSuccess = true;

    // Run basic functionality tests
    const basicTests = await this.runBasicTests();
    allResults.push(...basicTests.results);
    if (!basicTests.success) overallSuccess = false;

    allResults.push(''); // Separator

    // Run validation tests
    const validationTests = this.testFormValidation();
    allResults.push(...validationTests.results);
    if (!validationTests.success) overallSuccess = false;

    allResults.push(''); // Separator

    // Run accessibility tests
    const accessibilityTests = this.testAccessibility();
    allResults.push(...accessibilityTests.results);

    allResults.push(''); // Separator

    // Run responsive design tests
    const responsiveTests = this.testResponsiveDesign();
    allResults.push(...responsiveTests.results);

    // Summary
    allResults.push('');
    allResults.push('📊 TEST SUMMARY:');
    allResults.push(`Overall Status: ${overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);

    return {
      success: overallSuccess,
      results: allResults
    };
  }

  // Display test results in console
  static displayResults(results: string[]) {
    console.group('🧪 Integration Test Results');
    results.forEach(result => {
      if (result.includes('❌')) {
        console.error(result);
      } else if (result.includes('⚠️')) {
        console.warn(result);
      } else if (result.includes('✅')) {
        console.log(result);
      } else {
        console.info(result);
      }
    });
    console.groupEnd();
  }
}

// Auto-run tests in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Add test runner to window for manual testing
  (window as any).runIntegrationTests = async () => {
    const results = await IntegrationTest.runAllTests();
    IntegrationTest.displayResults(results.results);
    return results;
  };

  console.log('🧪 Integration tests available. Run window.runIntegrationTests() to execute.');
}