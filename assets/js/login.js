/**
 * Login Page JavaScript - Champion Hotel Management System
 * Handles form validation, user type switching, and authentication
 */

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const USER_TYPES = {
  customer: {
    title: 'Welcome Back',
    description: 'Access your bookings and reservations',
    buttonText: 'Sign In as Customer',
    useEmail: true,
  },
  staff: {
    title: 'Staff Portal',
    description: 'Access your work dashboard',
    buttonText: 'Sign In as Staff',
    useEmail: false,
  },
  admin: {
    title: 'Admin Portal',
    description: 'Manage hotel operations',
    buttonText: 'Sign In as Admin',
    useEmail: false,
  },
};

const ERROR_MESSAGES = {
  invalid_method: 'Unsupported request method. Please use the login form.',
  missing_password: 'Password is required to log in.',
  missing_identifier: 'Please provide your email or username to continue.',
  invalid_credentials: 'Invalid credentials. Please check your details and try again.',
  server: 'We could not process your login right now. Please try again shortly.',
  session_expired: 'Your session has expired. Please log in again.',
  auth: 'You must be logged in to access this page.',
  email_invalid: 'Please enter a valid email address.',
  username_required: 'Username is required.',
  password_required: 'Password is required.',
  password_min_length: 'Password must be at least 6 characters long.',
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  tabBtns: document.querySelectorAll('.tab-btn'),
  userTypeInput: document.getElementById('user-type-input'),
  emailGroup: document.getElementById('email-group'),
  usernameGroup: document.getElementById('username-group'),
  emailInput: document.getElementById('email'),
  usernameInput: document.getElementById('username'),
  passwordInput: document.getElementById('password'),
  togglePasswordBtn: document.getElementById('toggle-password'),
  loginForm: document.getElementById('login-form'),
  loginBtn: document.getElementById('login-btn'),
  portalTitle: document.getElementById('portal-title'),
  portalDescription: document.getElementById('portal-description'),
  alertContainer: document.getElementById('alert-container'),
  customerFooter: document.getElementById('customer-footer'),
  emailError: document.getElementById('email-error'),
  usernameError: document.getElementById('username-error'),
  passwordError: document.getElementById('password-error'),
};

// ============================================
// STATE MANAGEMENT
// ============================================
let currentUserType = 'customer';
let isSubmitting = false;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initializeUserType();
  attachEventListeners();
  checkForErrors();
});

/**
 * Initialize user type from URL or default to customer
 */
function initializeUserType() {
  const urlParams = new URLSearchParams(window.location.search);
  const userType = urlParams.get('user_type') || 'customer';

  if (USER_TYPES[userType]) {
    switchUserType(userType);

    // Activate the correct tab
    elements.tabBtns.forEach((btn) => {
      if (btn.dataset.userType === userType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // Tab switching
  elements.tabBtns.forEach((btn) => {
    btn.addEventListener('click', handleTabClick);
  });

  // Password toggle
  if (elements.togglePasswordBtn) {
    elements.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
  }

  // Form submission
  if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', handleFormSubmit);
  }

  // Real-time validation
  if (elements.emailInput) {
    elements.emailInput.addEventListener('blur', () => validateEmail());
    elements.emailInput.addEventListener('input', () => clearError('email'));
  }

  if (elements.usernameInput) {
    elements.usernameInput.addEventListener('blur', () => validateUsername());
    elements.usernameInput.addEventListener('input', () => clearError('username'));
  }

  if (elements.passwordInput) {
    elements.passwordInput.addEventListener('blur', () => validatePassword());
    elements.passwordInput.addEventListener('input', () => clearError('password'));
  }
}

/**
 * Check for error messages in URL
 */
function checkForErrors() {
  const urlParams = new URLSearchParams(window.location.search);
  const errorCode = urlParams.get('error');

  if (errorCode && ERROR_MESSAGES[errorCode]) {
    showAlert(ERROR_MESSAGES[errorCode], 'error');

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// ============================================
// USER TYPE SWITCHING
// ============================================
/**
 * Handle tab click event
 */
function handleTabClick(event) {
  const userType = event.currentTarget.dataset.userType;

  // Update active tab
  elements.tabBtns.forEach((btn) => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Switch user type
  switchUserType(userType);
}

/**
 * Switch between user types (customer, staff, admin)
 */
function switchUserType(userType) {
  if (!USER_TYPES[userType]) return;

  currentUserType = userType;
  const config = USER_TYPES[userType];

  // Update hidden input
  elements.userTypeInput.value = userType;

  // Update portal header
  elements.portalTitle.textContent = config.title;
  elements.portalDescription.textContent = config.description;

  // Update button text
  const btnText = elements.loginBtn.querySelector('.btn-text');
  if (btnText) {
    btnText.textContent = config.buttonText;
  }

  // Toggle email/username fields
  if (config.useEmail) {
    elements.emailGroup.style.display = 'block';
    elements.usernameGroup.style.display = 'none';
    elements.emailInput.required = true;
    elements.usernameInput.required = false;
    elements.customerFooter.style.display = 'block';
  } else {
    elements.emailGroup.style.display = 'none';
    elements.usernameGroup.style.display = 'block';
    elements.emailInput.required = false;
    elements.usernameInput.required = true;
    elements.customerFooter.style.display = 'none';
  }

  // Clear errors
  clearAllErrors();
  clearAlert();
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================
/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
  const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
  elements.passwordInput.type = type;

  const eyeIcon = elements.togglePasswordBtn.querySelector('.eye-icon');
  if (eyeIcon) {
    eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
  }
}

// ============================================
// FORM VALIDATION
// ============================================
/**
 * Validate email field
 */
function validateEmail() {
  if (currentUserType !== 'customer') return true;

  const email = elements.emailInput.value.trim();

  if (!email) {
    showError('email', ERROR_MESSAGES.missing_identifier);
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('email', ERROR_MESSAGES.email_invalid);
    return false;
  }

  clearError('email');
  return true;
}

/**
 * Validate username field
 */
function validateUsername() {
  if (currentUserType === 'customer') return true;

  const username = elements.usernameInput.value.trim();

  if (!username) {
    showError('username', ERROR_MESSAGES.username_required);
    return false;
  }

  clearError('username');
  return true;
}

/**
 * Validate password field
 */
function validatePassword() {
  const password = elements.passwordInput.value;

  if (!password) {
    showError('password', ERROR_MESSAGES.password_required);
    return false;
  }

  if (password.length < 6) {
    showError('password', ERROR_MESSAGES.password_min_length);
    return false;
  }

  clearError('password');
  return true;
}

/**
 * Validate entire form
 */
function validateForm() {
  let isValid = true;

  if (currentUserType === 'customer') {
    isValid = validateEmail() && isValid;
  } else {
    isValid = validateUsername() && isValid;
  }

  isValid = validatePassword() && isValid;

  return isValid;
}

// ============================================
// FORM SUBMISSION
// ============================================
/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  // Prevent double submission
  if (isSubmitting) return;

  // Clear previous alerts
  clearAlert();

  // Validate form
  if (!validateForm()) {
    showAlert('Please fix the errors before submitting.', 'error');
    return;
  }

  // Set loading state
  setLoadingState(true);
  isSubmitting = true;

  try {
    // Submit form
    elements.loginForm.submit();
  } catch (error) {
    console.error('Login error:', error);
    showAlert(ERROR_MESSAGES.server, 'error');
    setLoadingState(false);
    isSubmitting = false;
  }
}

// ============================================
// UI HELPERS
// ============================================
/**
 * Show error message for a field
 */
function showError(field, message) {
  const errorElement = elements[`${field}Error`];
  const inputElement = elements[`${field}Input`];

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  if (inputElement) {
    inputElement.classList.add('error');
  }
}

/**
 * Clear error message for a field
 */
function clearError(field) {
  const errorElement = elements[`${field}Error`];
  const inputElement = elements[`${field}Input`];

  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  if (inputElement) {
    inputElement.classList.remove('error');
  }
}

/**
 * Clear all error messages
 */
function clearAllErrors() {
  clearError('email');
  clearError('username');
  clearError('password');
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
  const alertClass = `alert alert-${type}`;
  elements.alertContainer.innerHTML = `
    <div class="${alertClass}" role="alert">
      ${message}
    </div>
  `;
  elements.alertContainer.style.display = 'block';
}

/**
 * Clear alert message
 */
function clearAlert() {
  elements.alertContainer.innerHTML = '';
  elements.alertContainer.style.display = 'none';
}

/**
 * Set loading state for submit button
 */
function setLoadingState(loading) {
  if (loading) {
    elements.loginBtn.classList.add('loading');
    elements.loginBtn.disabled = true;
    const spinner = elements.loginBtn.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'inline-block';
  } else {
    elements.loginBtn.classList.remove('loading');
    elements.loginBtn.disabled = false;
    const spinner = elements.loginBtn.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'none';
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Get URL parameter
 */
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
