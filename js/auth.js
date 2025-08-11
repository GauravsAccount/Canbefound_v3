// CanBeFound.com - Authentication System

// Authentication state
let authState = {
  isLoggedIn: false,
  currentUser: null,
  token: null
};

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
  initializeAuth();
  checkAuthStatus();
});

// Initialize authentication system
function initializeAuth() {
  // Initialize login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Initialize signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Initialize logout functionality
  const logoutBtns = document.querySelectorAll('.logout-btn, [data-action="logout"]');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });

  console.log('Authentication system initialized');
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const collegeId = form.collegeId.value.trim();
  const password = form.password.value;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Clear previous errors
  clearLoginErrors();
  
  // Validate inputs
  if (!collegeId || !password) {
    showLoginError('Please fill in all fields');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Logging in...';
  submitBtn.disabled = true;
  
  try {
    // Convert college ID to email format
    const email = collegeId.includes('@') ? collegeId : `${collegeId}@college.edu`;
    
    const result = await window.API.login(email, password);
    
    if (result.success && result.user) {
      // Store auth data
      authState.isLoggedIn = true;
      authState.currentUser = result.user;
      authState.token = result.token;
      
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      // Close modal
      if (window.ModalManager) {
        window.ModalManager.closeModal('loginModal');
      }
      
      // Show success message
      if (window.CanBeFound) {
        window.CanBeFound.showNotification(`Welcome back, ${result.user.name}!`, 'success');
      }
      
      // Update UI
      updateAuthUI();
      
      // Reset form
      form.reset();
      
    } else {
      showLoginError(result.error || 'Invalid credentials');
    }
    
  } catch (error) {
    console.error('Login failed:', error);
    showLoginError(error.message || 'Login failed. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Handle signup
async function handleSignup(e) {
  e.preventDefault();
  
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const collegeId = form.collegeId.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Clear previous errors
  clearSignupErrors();
  
  // Validate inputs
  if (!name || !email || !collegeId || !password || !confirmPassword) {
    showSignupError('Please fill in all fields');
    return;
  }
  
  if (!email.endsWith('@college.edu')) {
    showSignupError('Please use your college email address');
    return;
  }
  
  if (password !== confirmPassword) {
    showSignupError('Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    showSignupError('Password must be at least 6 characters long');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Creating Account...';
  submitBtn.disabled = true;
  
  try {
    const result = await window.API.signup(name, email, collegeId, password);
    
    if (result.success && result.user) {
      // Store auth data
      authState.isLoggedIn = true;
      authState.currentUser = result.user;
      authState.token = result.token || 'temp-token';
      
      localStorage.setItem('authToken', authState.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      // Close modal
      if (window.ModalManager) {
        window.ModalManager.closeModal('signupModal');
      }
      
      // Show success message
      if (window.CanBeFound) {
        window.CanBeFound.showNotification(`Welcome to CanBeFound, ${result.user.name}!`, 'success');
      }
      
      // Update UI
      updateAuthUI();
      
      // Reset form
      form.reset();
      
    } else {
      showSignupError(result.error || 'Account creation failed');
    }
    
  } catch (error) {
    console.error('Signup failed:', error);
    showSignupError(error.message || 'Account creation failed. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Handle logout
async function handleLogout() {
  try {
    await window.API.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local auth data
    authState.isLoggedIn = false;
    authState.currentUser = null;
    authState.token = null;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Update UI
    updateAuthUI();
    
    // Show message
    if (window.CanBeFound) {
      window.CanBeFound.showNotification('You have been logged out', 'info');
    }
    
    // Redirect to home if on protected page
    if (window.location.pathname.includes('admin') || window.location.pathname.includes('profile')) {
      window.location.href = 'index.html';
    }
  }
}

// Check authentication status
function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('currentUser');
  
  if (token && userData) {
    try {
      authState.isLoggedIn = true;
      authState.currentUser = JSON.parse(userData);
      authState.token = token;
      updateAuthUI();
    } catch (error) {
      console.error('Error parsing user data:', error);
      handleLogout();
    }
  }
}

// Update authentication UI
function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  
  if (authState.isLoggedIn && authState.currentUser) {
    // Update login button to show user name
    if (loginBtn) {
      loginBtn.textContent = authState.currentUser.name || 'Profile';
      loginBtn.onclick = () => {
        // Create user menu dropdown
        showUserMenu();
      };
    }
    
    // Update signup button to logout
    if (signupBtn) {
      signupBtn.textContent = 'Logout';
      signupBtn.onclick = handleLogout;
      signupBtn.className = 'btn btn-outline';
    }
  } else {
    // Reset to default state
    if (loginBtn) {
      loginBtn.textContent = 'Login';
      loginBtn.onclick = () => {
        if (window.ModalManager) {
          window.ModalManager.openModal('loginModal');
        }
      };
    }
    
    if (signupBtn) {
      signupBtn.textContent = 'Sign Up';
      signupBtn.onclick = () => {
        if (window.ModalManager) {
          window.ModalManager.openModal('signupModal');
        }
      };
      signupBtn.className = 'btn btn-primary';
    }
  }
}

// Show user menu
function showUserMenu() {
  // Create dropdown menu
  const existingMenu = document.getElementById('userMenu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }
  
  const menu = document.createElement('div');
  menu.id = 'userMenu';
  menu.className = 'user-menu';
  menu.innerHTML = `
    <div class="user-menu-content">
      <div class="user-info">
        <div class="user-name">${authState.currentUser.name}</div>
        <div class="user-email">${authState.currentUser.email}</div>
        <div class="user-role">${authState.currentUser.role}</div>
      </div>
      <div class="user-menu-actions">
        <a href="profile.html" class="menu-item">My Profile</a>
        <a href="my-items.html" class="menu-item">My Items</a>
        ${authState.currentUser.role === 'admin' ? '<a href="admin.html" class="menu-item">Admin Dashboard</a>' : ''}
        <button class="menu-item logout-item" onclick="handleLogout()">Logout</button>
      </div>
    </div>
  `;
  
  // Position menu
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    const rect = loginBtn.getBoundingClientRect();
    menu.style.cssText = `
      position: fixed;
      top: ${rect.bottom + 8}px;
      right: ${window.innerWidth - rect.right}px;
      background: var(--white);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      z-index: var(--z-dropdown);
      min-width: 200px;
      animation: slideDown 0.2s ease-out;
    `;
  }
  
  document.body.appendChild(menu);
  
  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target) && e.target !== loginBtn) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 100);
}

// Show login error
function showLoginError(message) {
  clearLoginErrors();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'login-error';
  errorDiv.style.cssText = `
    color: var(--error-color);
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.3);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    text-align: center;
  `;
  errorDiv.textContent = message;
  
  const loginForm = document.getElementById('loginForm');
  const firstFormGroup = loginForm.querySelector('.form-group');
  loginForm.insertBefore(errorDiv, firstFormGroup);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Clear login errors
function clearLoginErrors() {
  const existingError = document.querySelector('.login-error');
  if (existingError) {
    existingError.remove();
  }
}

// Show signup error
function showSignupError(message) {
  clearSignupErrors();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'signup-error';
  errorDiv.style.cssText = `
    color: var(--error-color);
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.3);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    text-align: center;
  `;
  errorDiv.textContent = message;
  
  const signupForm = document.getElementById('signupForm');
  const firstFormGroup = signupForm.querySelector('.form-group');
  signupForm.insertBefore(errorDiv, firstFormGroup);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Clear signup errors
function clearSignupErrors() {
  const existingError = document.querySelector('.signup-error');
  if (existingError) {
    existingError.remove();
  }
}

// Check if user is logged in
function isLoggedIn() {
  return authState.isLoggedIn;
}

// Get current user
function getCurrentUser() {
  return authState.currentUser;
}

// Require authentication for protected actions
function requireAuth(callback) {
  if (!authState.isLoggedIn) {
    if (window.ModalManager) {
      window.ModalManager.openModal('loginModal');
    }
    return false;
  }
  
  if (callback) {
    callback();
  }
  return true;
}

// Export auth functions
window.Auth = {
  isLoggedIn,
  getCurrentUser,
  requireAuth,
  handleLogin,
  handleSignup,
  handleLogout,
  checkAuthStatus,
  updateAuthUI
};