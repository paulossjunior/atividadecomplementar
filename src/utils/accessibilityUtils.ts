// Accessibility utilities for WCAG 2.1 AA compliance

export class AccessibilityUtils {
  
  // Focus management utilities
  static focusManagement = {
    
    // Store the last focused element before opening a modal/dialog
    lastFocusedElement: null as HTMLElement | null,
    
    // Set focus to an element and store the previous focus
    setFocus(element: HTMLElement, storePrevious: boolean = true) {
      if (storePrevious) {
        this.lastFocusedElement = document.activeElement as HTMLElement;
      }
      
      element.focus();
      
      // Ensure the element is actually focused
      if (document.activeElement !== element) {
        element.setAttribute('tabindex', '-1');
        element.focus();
      }
    },
    
    // Restore focus to the previously focused element
    restoreFocus() {
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    },
    
    // Trap focus within a container (for modals, dialogs)
    trapFocus(container: HTMLElement) {
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;
        
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };
      
      container.addEventListener('keydown', handleTabKey);
      
      // Return cleanup function
      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    },
    
    // Get all focusable elements within a container
    getFocusableElements(container: HTMLElement): HTMLElement[] {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ');
      
      const elements = container.querySelectorAll(focusableSelectors) as NodeListOf<HTMLElement>;
      return Array.from(elements).filter(element => {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
      });
    }
  };
  
  // ARIA utilities
  static aria = {
    
    // Announce text to screen readers
    announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
      const announcer = document.getElementById('aria-announcer') || this.createAnnouncer();
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    },
    
    // Create ARIA live region for announcements
    createAnnouncer(): HTMLElement {
      const announcer = document.createElement('div');
      announcer.id = 'aria-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      return announcer;
    },
    
    // Set ARIA expanded state
    setExpanded(element: HTMLElement, expanded: boolean) {
      element.setAttribute('aria-expanded', expanded.toString());
    },
    
    // Set ARIA selected state
    setSelected(element: HTMLElement, selected: boolean) {
      element.setAttribute('aria-selected', selected.toString());
    },
    
    // Set ARIA pressed state for toggle buttons
    setPressed(element: HTMLElement, pressed: boolean) {
      element.setAttribute('aria-pressed', pressed.toString());
    },
    
    // Set ARIA hidden state
    setHidden(element: HTMLElement, hidden: boolean) {
      if (hidden) {
        element.setAttribute('aria-hidden', 'true');
      } else {
        element.removeAttribute('aria-hidden');
      }
    },
    
    // Associate label with control
    associateLabel(control: HTMLElement, label: HTMLElement) {
      const labelId = label.id || `label-${Date.now()}`;
      label.id = labelId;
      control.setAttribute('aria-labelledby', labelId);
    },
    
    // Associate description with control
    associateDescription(control: HTMLElement, description: HTMLElement) {
      const descId = description.id || `desc-${Date.now()}`;
      description.id = descId;
      
      const existingDescribedBy = control.getAttribute('aria-describedby');
      const newDescribedBy = existingDescribedBy 
        ? `${existingDescribedBy} ${descId}`
        : descId;
      
      control.setAttribute('aria-describedby', newDescribedBy);
    }
  };
  
  // Keyboard navigation utilities
  static keyboard = {
    
    // Add arrow key navigation to a list of elements
    addArrowNavigation(
      container: HTMLElement, 
      items: HTMLElement[], 
      options: {
        wrap?: boolean;
        orientation?: 'horizontal' | 'vertical' | 'both';
        activateOnFocus?: boolean;
      } = {}
    ) {
      const { wrap = true, orientation = 'vertical', activateOnFocus = false } = options;
      
      const handleKeyDown = (event: KeyboardEvent) => {
        const currentIndex = items.indexOf(event.target as HTMLElement);
        if (currentIndex === -1) return;
        
        let nextIndex = currentIndex;
        
        switch (event.key) {
          case 'ArrowDown':
            if (orientation === 'vertical' || orientation === 'both') {
              event.preventDefault();
              nextIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
            }
            break;
            
          case 'ArrowUp':
            if (orientation === 'vertical' || orientation === 'both') {
              event.preventDefault();
              nextIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
            }
            break;
            
          case 'ArrowRight':
            if (orientation === 'horizontal' || orientation === 'both') {
              event.preventDefault();
              nextIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
            }
            break;
            
          case 'ArrowLeft':
            if (orientation === 'horizontal' || orientation === 'both') {
              event.preventDefault();
              nextIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
            }
            break;
            
          case 'Home':
            event.preventDefault();
            nextIndex = 0;
            break;
            
          case 'End':
            event.preventDefault();
            nextIndex = items.length - 1;
            break;
            
          case 'Enter':
          case ' ':
            if (activateOnFocus) {
              event.preventDefault();
              (event.target as HTMLElement).click();
            }
            break;
        }
        
        if (nextIndex !== currentIndex) {
          items[nextIndex].focus();
        }
      };
      
      container.addEventListener('keydown', handleKeyDown);
      
      // Return cleanup function
      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    },
    
    // Add escape key handler
    addEscapeHandler(element: HTMLElement, callback: () => void) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          callback();
        }
      };
      
      element.addEventListener('keydown', handleKeyDown);
      
      return () => {
        element.removeEventListener('keydown', handleKeyDown);
      };
    }
  };
  
  // Color contrast utilities
  static contrast = {
    
    // Calculate relative luminance
    getRelativeLuminance(color: string): number {
      const rgb = this.hexToRgb(color);
      if (!rgb) return 0;
      
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },
    
    // Calculate contrast ratio between two colors
    getContrastRatio(color1: string, color2: string): number {
      const lum1 = this.getRelativeLuminance(color1);
      const lum2 = this.getRelativeLuminance(color2);
      
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      
      return (lighter + 0.05) / (darker + 0.05);
    },
    
    // Check if contrast ratio meets WCAG standards
    meetsWCAG(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA', size: 'normal' | 'large' = 'normal'): boolean {
      const ratio = this.getContrastRatio(color1, color2);
      
      if (level === 'AAA') {
        return size === 'large' ? ratio >= 4.5 : ratio >= 7;
      } else {
        return size === 'large' ? ratio >= 3 : ratio >= 4.5;
      }
    },
    
    // Convert hex color to RGB
    hexToRgb(hex: string): [number, number, number] | null {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    }
  };
  
  // Form accessibility utilities
  static forms = {
    
    // Associate form errors with inputs
    associateErrors(form: HTMLFormElement) {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const inputElement = input as HTMLInputElement;
        const errorElement = form.querySelector(`[id$="${inputElement.name}-error"]`) as HTMLElement;
        
        if (errorElement) {
          AccessibilityUtils.aria.associateDescription(inputElement, errorElement);
        }
      });
    },
    
    // Add required field indicators
    addRequiredIndicators(form: HTMLFormElement) {
      const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      
      requiredInputs.forEach(input => {
        const label = form.querySelector(`label[for="${input.id}"]`) as HTMLElement;
        if (label && !label.querySelector('.required')) {
          const indicator = document.createElement('span');
          indicator.className = 'required';
          indicator.setAttribute('aria-label', 'obrigatório');
          indicator.textContent = '*';
          label.appendChild(indicator);
        }
      });
    },
    
    // Enhance form validation messages
    enhanceValidationMessages(form: HTMLFormElement) {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const inputElement = input as HTMLInputElement;
        
        inputElement.addEventListener('invalid', (event) => {
          event.preventDefault();
          
          const errorElement = form.querySelector(`[id$="${inputElement.name}-error"]`) as HTMLElement;
          if (errorElement) {
            errorElement.textContent = inputElement.validationMessage;
            errorElement.style.display = 'block';
            inputElement.setAttribute('aria-invalid', 'true');
            
            // Announce error to screen readers
            AccessibilityUtils.aria.announce(`Erro no campo ${inputElement.name}: ${inputElement.validationMessage}`, 'assertive');
          }
        });
        
        inputElement.addEventListener('input', () => {
          if (inputElement.validity.valid) {
            const errorElement = form.querySelector(`[id$="${inputElement.name}-error"]`) as HTMLElement;
            if (errorElement) {
              errorElement.style.display = 'none';
              inputElement.removeAttribute('aria-invalid');
            }
          }
        });
      });
    }
  };
  
  // Modal/Dialog accessibility
  static modal = {
    
    // Make a modal accessible
    makeAccessible(modal: HTMLElement, options: {
      closeOnEscape?: boolean;
      closeOnBackdrop?: boolean;
      trapFocus?: boolean;
    } = {}) {
      const { closeOnEscape = true, closeOnBackdrop = true, trapFocus = true } = options;
      
      // Set ARIA attributes
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      
      // Find or create title
      const title = modal.querySelector('h1, h2, h3, h4, h5, h6') as HTMLElement;
      if (title) {
        const titleId = title.id || `modal-title-${Date.now()}`;
        title.id = titleId;
        modal.setAttribute('aria-labelledby', titleId);
      }
      
      let cleanupFocusTrap: (() => void) | null = null;
      
      const openModal = () => {
        // Store current focus
        AccessibilityUtils.focusManagement.setFocus(modal);
        
        // Trap focus if enabled
        if (trapFocus) {
          cleanupFocusTrap = AccessibilityUtils.focusManagement.trapFocus(modal);
        }
        
        // Hide other content from screen readers
        const siblings = Array.from(document.body.children) as HTMLElement[];
        siblings.forEach(sibling => {
          if (sibling !== modal && !sibling.contains(modal)) {
            sibling.setAttribute('aria-hidden', 'true');
          }
        });
        
        modal.setAttribute('aria-hidden', 'false');
      };
      
      const closeModal = () => {
        // Restore focus
        AccessibilityUtils.focusManagement.restoreFocus();
        
        // Cleanup focus trap
        if (cleanupFocusTrap) {
          cleanupFocusTrap();
          cleanupFocusTrap = null;
        }
        
        // Restore screen reader access to other content
        const siblings = Array.from(document.body.children) as HTMLElement[];
        siblings.forEach(sibling => {
          sibling.removeAttribute('aria-hidden');
        });
        
        modal.setAttribute('aria-hidden', 'true');
      };
      
      // Add event listeners
      if (closeOnEscape) {
        AccessibilityUtils.keyboard.addEscapeHandler(modal, closeModal);
      }
      
      if (closeOnBackdrop) {
        modal.addEventListener('click', (event) => {
          if (event.target === modal) {
            closeModal();
          }
        });
      }
      
      // Add close button functionality
      const closeButtons = modal.querySelectorAll('[data-close], .modal-close');
      closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
      });
      
      return { openModal, closeModal };
    }
  };
  
  // Initialize accessibility features
  static init() {
    // Create ARIA announcer
    this.aria.createAnnouncer();
    
    // Add skip links if not present
    this.addSkipLinks();
    
    // Enhance all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      this.forms.associateErrors(form as HTMLFormElement);
      this.forms.addRequiredIndicators(form as HTMLFormElement);
      this.forms.enhanceValidationMessages(form as HTMLFormElement);
    });
    
    // Add focus indicators
    this.addFocusIndicators();
    
    // Add reduced motion support
    this.addReducedMotionSupport();
  }
  
  // Add skip links for keyboard navigation
  private static addSkipLinks() {
    if (document.querySelector('.skip-links')) return;
    
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>
      <a href="#navigation" class="skip-link">Pular para a navegação</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }
  
  // Add enhanced focus indicators
  private static addFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible {
        outline: 2px solid var(--color-border-focus, #2563eb);
        outline-offset: 2px;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        z-index: 1000;
        font-weight: bold;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Add reduced motion support
  private static addReducedMotionSupport() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const updateMotionPreference = () => {
      if (prefersReducedMotion.matches) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };
    
    updateMotionPreference();
    prefersReducedMotion.addEventListener('change', updateMotionPreference);
  }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  AccessibilityUtils.init();
});