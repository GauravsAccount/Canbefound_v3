// CanBeFound.com - Philosophy Page Functionality

// Philosophy page state
let philosophyState = {
  isAuthenticated: false,
  accessLevel: null
};

// Valid access credentials
const ACCESS_CREDENTIALS = {
  'admin123': 'admin',
  'brand2025': 'brand',
  'philosophy': 'viewer'
};

// Initialize philosophy page
document.addEventListener('DOMContentLoaded', function() {
  initializePhilosophyPage();
});

// Initialize philosophy page
function initializePhilosophyPage() {
  // Check if already authenticated
  checkExistingAuth();
  
  // Initialize password form
  initializePasswordForm();
  
  // Initialize animations
  initializeAnimations();
  
  console.log('Philosophy page initialized');
}

// Check existing authentication
function checkExistingAuth() {
  const authData = sessionStorage.getItem('philosophyAuth');
  
  if (authData) {
    try {
      const { timestamp, accessLevel } = JSON.parse(authData);
      const now = Date.now();
      const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
      
      if (now - timestamp < sessionDuration) {
        philosophyState.isAuthenticated = true;
        philosophyState.accessLevel = accessLevel;
        showMainContent();
        return;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  }
  
  // Clear any invalid auth data
  sessionStorage.removeItem('philosophyAuth');
}

// Initialize password form
function initializePasswordForm() {
  const passwordForm = document.getElementById('passwordForm');
  
  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordSubmission);
  }
}

// Handle password submission
function handlePasswordSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const password = form.password.value.trim();
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Clear previous errors
  clearPasswordError();
  
  if (!password) {
    showPasswordError('Please enter a password');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Verifying...';
  submitBtn.disabled = true;
  
  // Simulate verification delay
  setTimeout(() => {
    const accessLevel = ACCESS_CREDENTIALS[password];
    
    if (accessLevel) {
      // Valid password
      philosophyState.isAuthenticated = true;
      philosophyState.accessLevel = accessLevel;
      
      // Store auth data
      const authData = {
        timestamp: Date.now(),
        accessLevel: accessLevel
      };
      sessionStorage.setItem('philosophyAuth', JSON.stringify(authData));
      
      // Show main content
      showMainContent();
      
      // Log access
      console.log(`Philosophy page accessed with ${accessLevel} level`);
      
    } else {
      // Invalid password
      showPasswordError('Invalid access password');
      
      // Reset form
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.password.value = '';
      form.password.focus();
    }
  }, 1000);
}

// Show main content
function showMainContent() {
  const overlay = document.getElementById('passwordOverlay');
  const mainContent = document.getElementById('mainContent');
  
  if (overlay && mainContent) {
    // Fade out overlay
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      overlay.style.display = 'none';
      mainContent.style.display = 'block';
      
      // Fade in main content
      mainContent.style.opacity = '0';
      mainContent.style.transition = 'opacity 0.5s ease-in';
      
      setTimeout(() => {
        mainContent.style.opacity = '1';
        
        // Initialize main content features
        initializeMainContent();
        
        // Announce to screen readers
        if (window.Accessibility) {
          window.Accessibility.announceToScreenReader('Philosophy page content loaded');
        }
      }, 50);
    }, 500);
  }
}

// Initialize main content features
function initializeMainContent() {
  // Initialize navigation
  if (window.CanBeFound) {
    // Navigation is handled by main.js
  }
  
  // Initialize accessibility features
  if (window.Accessibility) {
    // Accessibility is handled by accessibility.js
  }
  
  // Add access level indicator
  addAccessLevelIndicator();
  
  // Initialize interactive elements
  initializeInteractiveElements();
}

// Add access level indicator
function addAccessLevelIndicator() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar && philosophyState.accessLevel) {
    const indicator = document.createElement('div');
    indicator.className = 'access-indicator';
    indicator.innerHTML = `
      <span class="access-icon">🔓</span>
      <span class="access-text">Access Level: ${philosophyState.accessLevel.toUpperCase()}</span>
    `;
    indicator.style.cssText = `
      position: fixed;
      top: 80px;
      right: var(--spacing-md);
      background: var(--success-color);
      color: var(--white);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      z-index: var(--z-sticky);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      box-shadow: var(--shadow-md);
    `;
    
    document.body.appendChild(indicator);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (indicator.parentElement) {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => indicator.remove(), 300);
      }
    }, 5000);
  }
}

// Initialize interactive elements
function initializeInteractiveElements() {
  // Animate spectrum bars
  const spectrumFills = document.querySelectorAll('.spectrum-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
          fill.style.width = width;
        }, 200);
        
        observer.unobserve(fill);
      }
    });
  });
  
  spectrumFills.forEach(fill => observer.observe(fill));
  
  // Add hover effects to cards
  const cards = document.querySelectorAll('.philosophy-card, .principle-card, .ux-card, .advantage-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Show password error
function showPasswordError(message) {
  const errorElement = document.getElementById('passwordError');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  // Announce error to screen readers
  if (window.Accessibility) {
    window.Accessibility.announceToScreenReader(`Error: ${message}`);
  }
}

// Clear password error
function clearPasswordError() {
  const errorElement = document.getElementById('passwordError');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

// Handle page visibility change (security feature)
document.addEventListener('visibilitychange', function() {
  if (document.hidden && philosophyState.isAuthenticated) {
    // Start session timeout when page is hidden
    setTimeout(() => {
      if (document.hidden) {
        // Auto-logout after 10 minutes of inactivity
        sessionStorage.removeItem('philosophyAuth');
        window.location.reload();
      }
    }, 10 * 60 * 1000);
  }
});

// Prevent right-click and text selection for security
document.addEventListener('contextmenu', function(e) {
  if (philosophyState.isAuthenticated) {
    e.preventDefault();
  }
});

document.addEventListener('selectstart', function(e) {
  if (philosophyState.isAuthenticated && e.target.closest('.philosophy-card, .ux-card')) {
    e.preventDefault();
  }
});

// Export philosophy functions
window.PhilosophyManager = {
  checkExistingAuth,
  showMainContent,
  getAccessLevel: () => philosophyState.accessLevel
};