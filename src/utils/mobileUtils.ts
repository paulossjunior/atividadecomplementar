// Mobile and touch interaction utilities

export class MobileUtils {
  
  // Check if device is mobile
  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Check if device supports touch
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // Get viewport dimensions
  static getViewportSize(): { width: number; height: number } {
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
  }

  // Check if viewport is mobile size
  static isMobileViewport(): boolean {
    return this.getViewportSize().width < 768;
  }

  // Add touch-friendly interactions to elements
  static enhanceTouchInteractions(element: HTMLElement) {
    if (!this.isTouchDevice()) return;

    // Add touch feedback
    element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    element.addEventListener('touchcancel', this.handleTouchEnd.bind(this));

    // Prevent double-tap zoom on buttons
    if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
      element.addEventListener('touchend', (event) => {
        event.preventDefault();
        element.click();
      });
    }
  }

  private static handleTouchStart(event: TouchEvent) {
    const element = event.currentTarget as HTMLElement;
    element.classList.add('touch-active');
  }

  private static handleTouchEnd(event: TouchEvent) {
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('touch-active');
  }

  // Optimize form inputs for mobile
  static optimizeFormForMobile(form: HTMLFormElement) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement;
      
      // Set appropriate input modes
      switch (inputElement.type) {
        case 'email':
          inputElement.inputMode = 'email';
          break;
        case 'tel':
          inputElement.inputMode = 'tel';
          break;
        case 'number':
          inputElement.inputMode = 'numeric';
          break;
        case 'url':
          inputElement.inputMode = 'url';
          break;
      }

      // Add mobile-specific attributes
      if (inputElement.type === 'search') {
        inputElement.setAttribute('autocomplete', 'off');
        inputElement.setAttribute('autocorrect', 'off');
        inputElement.setAttribute('autocapitalize', 'off');
        inputElement.setAttribute('spellcheck', 'false');
      }

      // Ensure minimum touch target size
      this.ensureMinimumTouchTarget(inputElement);
    });

    // Add mobile-specific form behaviors
    this.addMobileFormBehaviors(form);
  }

  // Ensure minimum 44px touch target
  static ensureMinimumTouchTarget(element: HTMLElement) {
    if (!this.isTouchDevice()) return;

    const computedStyle = window.getComputedStyle(element);
    const minSize = 44; // 44px minimum as per accessibility guidelines

    const currentHeight = parseInt(computedStyle.height);
    const currentWidth = parseInt(computedStyle.width);

    if (currentHeight < minSize) {
      element.style.minHeight = `${minSize}px`;
    }

    if (currentWidth < minSize && element.tagName === 'BUTTON') {
      element.style.minWidth = `${minSize}px`;
    }
  }

  // Add mobile-specific form behaviors
  private static addMobileFormBehaviors(form: HTMLFormElement) {
    // Scroll to focused input on mobile to avoid keyboard overlap
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (this.isMobileViewport()) {
          setTimeout(() => {
            input.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }, 300); // Wait for keyboard to appear
        }
      });
    });

    // Handle form submission on mobile
    form.addEventListener('submit', (event) => {
      if (this.isMobileViewport()) {
        // Blur active element to hide keyboard
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    });
  }

  // Add swipe gestures to elements
  static addSwipeGestures(
    element: HTMLElement, 
    callbacks: {
      onSwipeLeft?: () => void;
      onSwipeRight?: () => void;
      onSwipeUp?: () => void;
      onSwipeDown?: () => void;
    }
  ) {
    if (!this.isTouchDevice()) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    const minSwipeDistance = 50;

    element.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    });

    element.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0];
      endX = touch.clientX;
      endY = touch.clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine swipe direction
      if (Math.max(absDeltaX, absDeltaY) > minSwipeDistance) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && callbacks.onSwipeRight) {
            callbacks.onSwipeRight();
          } else if (deltaX < 0 && callbacks.onSwipeLeft) {
            callbacks.onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && callbacks.onSwipeDown) {
            callbacks.onSwipeDown();
          } else if (deltaY < 0 && callbacks.onSwipeUp) {
            callbacks.onSwipeUp();
          }
        }
      }
    });
  }

  // Optimize table for mobile viewing
  static optimizeTableForMobile(table: HTMLTableElement) {
    if (!this.isMobileViewport()) return;

    // Add horizontal scroll wrapper
    if (!table.parentElement?.classList.contains('table-scroll-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll-wrapper';
      wrapper.style.overflowX = 'auto';
      wrapper.style.webkitOverflowScrolling = 'touch';
      
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }

    // Add touch scroll indicators
    this.addScrollIndicators(table.parentElement as HTMLElement);
  }

  // Add scroll indicators for touch scrolling
  private static addScrollIndicators(container: HTMLElement) {
    const leftIndicator = document.createElement('div');
    const rightIndicator = document.createElement('div');
    
    leftIndicator.className = 'scroll-indicator scroll-indicator-left';
    rightIndicator.className = 'scroll-indicator scroll-indicator-right';
    
    leftIndicator.innerHTML = '◀';
    rightIndicator.innerHTML = '▶';
    
    container.appendChild(leftIndicator);
    container.appendChild(rightIndicator);

    // Update indicators based on scroll position
    const updateIndicators = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      leftIndicator.style.opacity = scrollLeft > 0 ? '1' : '0';
      rightIndicator.style.opacity = scrollLeft < scrollWidth - clientWidth ? '1' : '0';
    };

    container.addEventListener('scroll', updateIndicators);
    updateIndicators(); // Initial state
  }

  // Add pull-to-refresh functionality
  static addPullToRefresh(
    container: HTMLElement, 
    onRefresh: () => Promise<void>,
    options: {
      threshold?: number;
      resistance?: number;
    } = {}
  ) {
    if (!this.isTouchDevice()) return;

    const { threshold = 80, resistance = 2.5 } = options;
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let isRefreshing = false;

    // Create refresh indicator
    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'pull-refresh-indicator';
    refreshIndicator.innerHTML = '↓ Puxe para atualizar';
    refreshIndicator.style.cssText = `
      position: absolute;
      top: -60px;
      left: 0;
      right: 0;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary);
      color: white;
      font-weight: 500;
      transition: transform 0.3s ease;
      z-index: 10;
    `;
    
    container.style.position = 'relative';
    container.insertBefore(refreshIndicator, container.firstChild);

    container.addEventListener('touchstart', (event) => {
      if (container.scrollTop === 0) {
        startY = event.touches[0].clientY;
        isPulling = true;
      }
    });

    container.addEventListener('touchmove', (event) => {
      if (!isPulling || isRefreshing) return;

      currentY = event.touches[0].clientY;
      const pullDistance = (currentY - startY) / resistance;

      if (pullDistance > 0) {
        event.preventDefault();
        const translateY = Math.min(pullDistance, threshold);
        
        container.style.transform = `translateY(${translateY}px)`;
        refreshIndicator.style.transform = `translateY(${translateY}px)`;
        
        if (pullDistance >= threshold) {
          refreshIndicator.innerHTML = '↑ Solte para atualizar';
          refreshIndicator.style.background = 'var(--color-success)';
        } else {
          refreshIndicator.innerHTML = '↓ Puxe para atualizar';
          refreshIndicator.style.background = 'var(--color-primary)';
        }
      }
    });

    container.addEventListener('touchend', async () => {
      if (!isPulling || isRefreshing) return;

      const pullDistance = (currentY - startY) / resistance;
      
      if (pullDistance >= threshold) {
        isRefreshing = true;
        refreshIndicator.innerHTML = '⟳ Atualizando...';
        
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          isRefreshing = false;
        }
      }

      // Reset
      container.style.transform = '';
      refreshIndicator.style.transform = '';
      refreshIndicator.innerHTML = '↓ Puxe para atualizar';
      refreshIndicator.style.background = 'var(--color-primary)';
      
      isPulling = false;
      startY = 0;
      currentY = 0;
    });
  }

  // Optimize images for mobile
  static optimizeImagesForMobile() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading="lazy" for better performance
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Ensure images are responsive
      if (!img.style.maxWidth) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }
    });
  }

  // Add mobile-specific CSS classes
  static addMobileClasses() {
    const html = document.documentElement;
    
    if (this.isMobile()) {
      html.classList.add('is-mobile');
    }
    
    if (this.isTouchDevice()) {
      html.classList.add('is-touch');
    }
    
    if (this.isMobileViewport()) {
      html.classList.add('is-mobile-viewport');
    }

    // Update classes on resize
    window.addEventListener('resize', () => {
      if (this.isMobileViewport()) {
        html.classList.add('is-mobile-viewport');
      } else {
        html.classList.remove('is-mobile-viewport');
      }
    });
  }

  // Initialize all mobile optimizations
  static init() {
    this.addMobileClasses();
    this.optimizeImagesForMobile();

    // Optimize all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => this.optimizeFormForMobile(form as HTMLFormElement));

    // Optimize all tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => this.optimizeTableForMobile(table as HTMLTableElement));

    // Add touch interactions to interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn, [role="button"]');
    interactiveElements.forEach(element => {
      this.enhanceTouchInteractions(element as HTMLElement);
      this.ensureMinimumTouchTarget(element as HTMLElement);
    });

    // Prevent zoom on input focus (iOS Safari)
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const content = viewport.getAttribute('content');
        if (content && !content.includes('user-scalable=no')) {
          viewport.setAttribute('content', content + ', user-scalable=no');
        }
      }
    }
  }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  MobileUtils.init();
});

// CSS for mobile enhancements
const mobileCSS = `
  .touch-active {
    opacity: 0.7;
    transform: scale(0.98);
    transition: all 0.1s ease;
  }

  .table-scroll-wrapper {
    position: relative;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .scroll-indicator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 8px;
    border-radius: 50%;
    font-size: 12px;
    z-index: 10;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .scroll-indicator-left {
    left: 8px;
  }

  .scroll-indicator-right {
    right: 8px;
  }

  @media (max-width: 768px) {
    .is-mobile-viewport .btn {
      min-height: 48px;
      padding: 12px 16px;
    }

    .is-mobile-viewport .form-input {
      min-height: 48px;
      font-size: 16px; /* Prevent zoom on iOS */
    }

    .is-mobile-viewport .table {
      font-size: 14px;
    }

    .is-mobile-viewport .table th,
    .is-mobile-viewport .table td {
      padding: 8px 12px;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    /* Touch device specific styles */
    .btn:hover {
      /* Remove hover effects on touch devices */
      background-color: initial;
      border-color: initial;
      color: initial;
    }
  }
`;

// Inject mobile CSS
const style = document.createElement('style');
style.textContent = mobileCSS;
document.head.appendChild(style);