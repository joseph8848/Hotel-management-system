// Tab switching functionality for login page
const tabBtns = document.querySelectorAll('.tab-btn');
const userTypeInput = document.querySelector('input[name="user_type"]');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('login-btn');
const portalTitle = document.getElementById('portal-title');
const portalDesc = document.getElementById('portal-desc');
const registerLink = document.getElementById('register-link');
const form = document.querySelector('.login-form');
const demoMode = false;
const TEMP_EMAIL = 'kilonzojoseph8848@gmail.com';
const TEMP_PASSWORD = '8848joseph';
const DASHBOARD_TARGETS = {
  admin: { static: 'admin-dashboard.html', dynamic: 'admin-dashboard.html' },
  staff: { static: 'staff-dashboard.html', dynamic: 'staff-dashboard.html' },
  customer: { static: 'customer-dashboard.html', dynamic: 'customer-dashboard.html' },
};
const preferStaticDashboards = true;
const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordField = document.getElementById('password');
const loginContainer = document.querySelector('.login-container');
const logoEl = document.querySelector('.logo');
const formAlert = document.getElementById('form-alert');
const rememberCheckbox = document.getElementById('remember');
const keepSignedInCheckbox = document.getElementById('keep-signed-in');

// Function to update form elements based on user type
function updateFormForUserType(userType) {
  if (userType === 'staff') {
    if (usernameInput) {
      usernameInput.style.display = 'block';
      usernameInput.required = true;
    }
    if (emailInput) {
      emailInput.style.display = 'none';
      emailInput.required = false;
    }
    if (loginBtn) loginBtn.textContent = 'Login as Staff';
    if (portalTitle) portalTitle.textContent = 'Staff Portal';
    if (portalDesc) portalDesc.textContent = 'Access your work dashboard';
    if (registerLink) registerLink.style.display = 'none';
  } else if (userType === 'admin') {
    if (usernameInput) {
      usernameInput.style.display = 'block';
      usernameInput.required = true;
    }
    if (emailInput) {
      emailInput.style.display = 'none';
      emailInput.required = false;
    }
    if (loginBtn) loginBtn.textContent = 'Login as Admin';
    if (portalTitle) portalTitle.textContent = 'Admin Portal';
    if (portalDesc) portalDesc.textContent = 'Manage hotel operations';
    if (registerLink) registerLink.style.display = 'none';
  } else {
    // Default to customer
    if (usernameInput) {
      usernameInput.style.display = 'none';
      usernameInput.required = false;
    }
    if (emailInput) {
      emailInput.style.display = 'block';
      emailInput.required = true;
    }
    if (loginBtn) loginBtn.textContent = 'Login as Customer';
    if (portalTitle) portalTitle.textContent = 'Customer Portal';
    if (portalDesc) portalDesc.textContent = 'Access your bookings and reservations';
    if (registerLink) registerLink.style.display = 'block';
  }
}

// Initialize the login form based on the active tab on page load
function initializeTabState() {
  const activeTab = document.querySelector('.tab-btn.active');
  if (activeTab) {
    const userType = activeTab.getAttribute('data-value');
    updateFormForUserType(userType);
  }
}

const loginErrorMessages = {
  invalid_method: 'Unsupported request method. Please use the login form.',
  missing_password: 'Password is required to log in.',
  missing_identifier: 'Please provide your email or username to continue.',
  invalid_credentials: 'Invalid credentials. Please check your details and try again.',
  server: 'We could not process your login right now. Please try again shortly.',
};



function setActiveUserType(userType) {
  if (!userType) return;
  const tab = document.querySelector(`.tab-btn[data-value="${userType}"]`);
  if (tab) {
    tab.click();
  }
}














function resolveElement(target) {
  if (!target) return null;
  return typeof target === 'string' ? document.getElementById(target) : target;
}

function resolveTemplate(target) {
  if (!target) return null;
  return typeof target === 'string' ? document.getElementById(target) : target;
}

function renderTemplateList(containerId, templateId, items, populate, emptyMessage, emptyColspan) {
  const container = resolveElement(containerId);
  const template = resolveTemplate(templateId);
  if (!container) return;
  container.innerHTML = '';

  if (!template || !Array.isArray(items) || !items.length) {
    if (emptyMessage) {
      const fallback = document.createElement(container.tagName === 'TBODY' ? 'tr' : 'div');
      if (container.tagName === 'TBODY') {
        const cell = document.createElement('td');
        cell.colSpan =
          emptyColspan || container.closest('table')?.querySelectorAll('th').length || 1;
        cell.className = 'empty-state';
        cell.textContent = emptyMessage;
        fallback.appendChild(cell);
      } else {
        fallback.className = 'empty-state';
        fallback.textContent = emptyMessage;
      }
      container.appendChild(fallback);
    }
    return;
  }

  items.forEach((item) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    populate(clone, item);
    container.appendChild(clone);
  });
}

function renderTemplateCards(containerId, templateId, items) {
  const container = resolveElement(containerId);
  const template = resolveTemplate(templateId);
  if (!container) return;
  container.innerHTML = '';

  if (!template || !Array.isArray(items) || !items.length) return;

  items.forEach((item) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="title"]', item.title);
    setDomField(clone, '[data-field="description"]', item.description);
    container.appendChild(clone);
  });
}

let adminRevenueChart = null;




function displayGlobalFormAlert(message, tone = 'error') {
  if (!formAlert) return;
  formAlert.textContent = message;
  formAlert.classList.remove('error', 'success', 'info');
  formAlert.classList.add('visible', tone);
}

function handleLoginErrorFromQuery() {
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const requestedType = params.get('user_type');
  if (requestedType) {
    setActiveUserType(requestedType);
  }

  const errorCode = params.get('error');
  if (!errorCode) return;

  const message = loginErrorMessages[errorCode] || 'Unable to process login. Please try again.';
  displayGlobalFormAlert(message, 'error');

  switch (errorCode) {
    case 'missing_identifier': {
      if (requestedType === 'customer') {
        setFieldError(emailInput, emailError, 'Email is required');
      } else {
        setFieldError(usernameInput, usernameError, 'Username is required');
      }
      break;
    }
    case 'missing_password': {
      setFieldError(passwordField, passwordError, 'Password is required');
      break;
    }
    case 'invalid_credentials': {
      if (requestedType === 'customer') {
        setFieldError(emailInput, emailError, 'Check the email entered');
      } else {
        setFieldError(usernameInput, usernameError, 'Check the username entered');
      }
      setFieldError(passwordField, passwordError, 'Check the password entered');
      break;
    }
    default:
      break;
  }

  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    url.searchParams.delete('user_type');
    const nextSearch = url.searchParams.toString();
    window.history.replaceState(
      {},
      document.title,
      `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`
    );
  }
}

const defaultStaffProfile = {
  role: 'frontdesk',
  roleLabel: 'Front Desk',
  name: 'Team Member',
  shiftStart: '07:00',
  shiftEnd: '15:00',
  ext: '214',
};


function capitaliseName(input) {
  if (!input) return 'Team Member';
  return input
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function wireActionForms() {
  const actionForms = document.querySelectorAll('[data-action-form]');
  if (!actionForms.length) return;

  actionForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const actionType = form.dataset.actionForm;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      console.log(`[Action Hub] ${actionType} submitted`, payload);
      form.classList.add('submitted');
      form.querySelectorAll('input, textarea').forEach((input) => {
        if (input.type !== 'datetime-local') {
          input.value = '';
        }
      });
      const statusBanner = ensureActionBanner(
        form,
        `Request submitted for ${formatActionLabel(actionType)}.`
      );
      statusBanner.classList.add('success');
    });

    form.querySelectorAll('button[data-action]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const action = button.dataset.action;
        if (!action) return;
        console.log(`[Action Hub] Triggered ${action}`);
        const banner = ensureActionBanner(form, `${formatActionLabel(action)} triggered.`);
        banner.classList.remove('success');
      });
    });
  });
}

function ensureActionBanner(form, message) {
  let banner = form.parentElement.querySelector('.action-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'action-banner';
    form.parentElement.insertBefore(banner, form.nextSibling);
  }
  banner.textContent = message;
  return banner;
}

function formatActionLabel(action) {
  if (!action) return 'action';
  return action.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatRoleLabel(roleKey) {
  if (!roleKey) return defaultStaffProfile.roleLabel;
  return roleKey
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function resolveStaffProfile(username) {
  const cleaned = (username || '').trim().toLowerCase();
  if (!cleaned) return { ...defaultStaffProfile };
  if (staffProfiles[cleaned]) {
    return { ...staffProfiles[cleaned] };
  }

  const fallback = { ...defaultStaffProfile };
  fallback.name = capitaliseName(username);
  fallback.roleLabel = formatRoleLabel(fallback.role);
  return fallback;
}

function persistStaffContext(context) {
  try {
    localStorage.setItem('staffContext', JSON.stringify(context));
  } catch (error) {
    console.warn('Unable to persist staff context', error);
  }
}

function clearStaffContext() {
  try {
    localStorage.removeItem('staffContext');
  } catch (error) {
    console.warn('Unable to clear staff context', error);
  }
}

function loadStaffContext() {
  try {
    const raw = localStorage.getItem('staffContext');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to load staff context', error);
    return null;
  }
}

function applyStaffDataset(profile) {
  if (!profile) return;
  const root = document.body;
  if (!root) return;
  root.dataset.staffRole = profile.role || defaultStaffProfile.role;
  root.dataset.staffRoleLabel = profile.roleLabel || profile.role || defaultStaffProfile.roleLabel;
  root.dataset.staffName = profile.name || defaultStaffProfile.name;
  root.dataset.staffShiftStart = profile.shiftStart || defaultStaffProfile.shiftStart;
  root.dataset.staffShiftEnd = profile.shiftEnd || defaultStaffProfile.shiftEnd;
  root.dataset.staffExt = profile.ext || defaultStaffProfile.ext;
}

function syncStaffHiddenFields(targetForm, profile) {
  if (!targetForm || !profile) return;
  const payload = {
    staff_role: profile.role,
    staff_role_label: profile.roleLabel,
    staff_name: profile.name,
    staff_shift_start: profile.shiftStart,
    staff_shift_end: profile.shiftEnd,
    staff_ext: profile.ext,
  };

  Object.entries(payload).forEach(([name, value]) => {
    let input = targetForm.querySelector(`input[name="${name}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      targetForm.appendChild(input);
    }
    input.value = value || '';
  });
}

function removeStaffHiddenFields(targetForm) {
  if (!targetForm) return;
  [
    'staff_role',
    'staff_role_label',
    'staff_name',
    'staff_shift_start',
    'staff_shift_end',
    'staff_ext',
  ].forEach((name) => {
    const input = targetForm.querySelector(`input[name="${name}"]`);
    if (input) input.remove();
  });
}

function prepareStaffSession(userType) {
  if (userType !== 'staff') {
    clearStaffContext();
    removeStaffHiddenFields(form);
    return null;
  }

  const usernameValue = usernameInput ? usernameInput.value : '';
  const profile = resolveStaffProfile(usernameValue);
  persistStaffContext(profile);
  syncStaffHiddenFields(form, profile);
  return profile;
}

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.switch-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    const userType = btn.getAttribute('data-value');
    userTypeInput.value = userType;
    clearErrors();
    if (loginContainer && typeof setLoginBackgroundFor === 'function') {
      setLoginBackgroundFor(userType);
    }

    // Update form based on user type
    if (userType === 'staff') {
      usernameInput.style.display = 'block';
      emailInput.style.display = 'none';
      usernameInput.required = true;
      emailInput.required = false;
      loginBtn.textContent = 'Login as Staff';
      portalTitle.textContent = 'Staff Portal';
      portalDesc.textContent = 'Access your work dashboard';
      registerLink.style.display = 'none';
    } else if (userType === 'admin') {
      usernameInput.style.display = 'block';
      emailInput.style.display = 'none';
      usernameInput.required = true;
      emailInput.required = false;
      loginBtn.textContent = 'Login as Admin';
      portalTitle.textContent = 'Admin Portal';
      portalDesc.textContent = 'Manage hotel operations';
      registerLink.style.display = 'none';
    } else {
      usernameInput.style.display = 'none';
      emailInput.style.display = 'block';
      usernameInput.required = false;
      emailInput.required = true;
      loginBtn.textContent = 'Login as Customer';
      portalTitle.textContent = 'Champion Hotel';
      portalDesc.textContent = 'Access your bookings and reservations';
      registerLink.style.display = 'block';
    }
  });
});

function attachTabHandler(btn) {
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.switch-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const userType = btn.getAttribute('data-value');
    if (userTypeInput) userTypeInput.value = userType;
    clearErrors();
    if (loginContainer && typeof setLoginBackgroundFor === 'function') {
      setLoginBackgroundFor(userType);
    }

    if (userType === 'staff') {
      if (usernameInput) {
        usernameInput.style.display = 'block';
        usernameInput.required = true;
      }
      if (emailInput) {
        emailInput.style.display = 'none';
        emailInput.required = false;
      }
      if (loginBtn) loginBtn.textContent = 'Login as Staff';
      if (portalTitle) portalTitle.textContent = 'Staff Portal';
      if (portalDesc) portalDesc.textContent = 'Access your work dashboard';
      if (registerLink) registerLink.style.display = 'none';
    } else if (userType === 'admin') {
      if (usernameInput) {
        usernameInput.style.display = 'block';
        usernameInput.required = true;
      }
      if (emailInput) {
        emailInput.style.display = 'none';
        emailInput.required = false;
      }
      if (loginBtn) loginBtn.textContent = 'Login as Admin';
      if (portalTitle) portalTitle.textContent = 'Admin Portal';
      if (portalDesc) portalDesc.textContent = 'Manage hotel operations';
      if (registerLink) registerLink.style.display = 'none';
    } else {
      // Default to customer
      if (usernameInput) {
        usernameInput.style.display = 'none';
        usernameInput.required = false;
      }
      if (emailInput) {
        emailInput.style.display = 'block';
        emailInput.required = true;
      }
      if (loginBtn) loginBtn.textContent = 'Login as Customer';
      if (portalTitle) portalTitle.textContent = 'Customer Portal';
      if (portalDesc) portalDesc.textContent = 'Access your bookings and reservations';
      if (registerLink) registerLink.style.display = 'block';
    }
  });
}

function toggleAdminTab() {
  const tabs = document.querySelector('.switch-tabs');
  if (!tabs) return;
  const existing = tabs.querySelector('.admin-tab');
  if (existing) {
    const wasActive = existing.classList.contains('active');
    existing.remove();
    if (wasActive) {
      const customerBtn = tabs.querySelector('.tab-btn[data-value="customer"]');
      if (customerBtn) customerBtn.click();
    }
  } else {
    const adminBtn = document.createElement('button');
    adminBtn.type = 'button';
    adminBtn.className = 'tab-btn admin-tab';
    adminBtn.setAttribute('data-value', 'admin');
    adminBtn.textContent = 'Admin';
    tabs.appendChild(adminBtn);
    attachTabHandler(adminBtn);
  }
}

if (logoEl) {
  logoEl.addEventListener('dblclick', toggleAdminTab);
}

function redirectToDashboard(userType, opts = {}) {
  const normalized = ['admin', 'staff'].includes(userType) ? userType : 'customer';
  const target = DASHBOARD_TARGETS[normalized] || DASHBOARD_TARGETS.customer;
  const useStatic =
    typeof opts.preferStatic === 'boolean' ? opts.preferStatic : preferStaticDashboards;
  window.location.href = useStatic ? target.static : target.dynamic;
}

// Form submission is now handled by the inline script in login.html
// which uses fetch() to call /api/auth/login.
// The code below is intentionally removed to avoid conflicts with the new API-based login.
// Tab switching, validation, and password toggle above still work as before.

function setFieldError(inputEl, errorEl, msg) {
  if (!inputEl || !errorEl) return;
  errorEl.textContent = msg;
  inputEl.classList.add('invalid');
}

function clearFieldError(inputEl, errorEl) {
  if (!inputEl || !errorEl) return;
  errorEl.textContent = '';
  inputEl.classList.remove('invalid');
}

function clearErrors() {
  clearFieldError(usernameInput, usernameError);
  clearFieldError(emailInput, emailError);
  clearFieldError(passwordField, passwordError);
}

function validateEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let ok = true;
  const userType = userTypeInput ? userTypeInput.value || 'customer' : 'customer';
  const pwd = passwordField ? passwordField.value.trim() : '';
  if (passwordField && pwd.length < 6) {
    setFieldError(passwordField, passwordError, 'Password must be at least 6 characters');
    ok = false;
  }
  if (userType === 'customer') {
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      setFieldError(emailInput, emailError, 'Email is required');
      ok = false;
    } else if (!validateEmailFormat(emailVal)) {
      setFieldError(emailInput, emailError, 'Enter a valid email');
      ok = false;
    }
  } else {
    const userVal = usernameInput ? usernameInput.value.trim() : '';
    if (!userVal) {
      setFieldError(usernameInput, usernameError, 'Username is required');
      ok = false;
    }
  }
  return ok;
}

if (usernameInput && usernameError) {
  usernameInput.addEventListener('input', () => clearFieldError(usernameInput, usernameError));
}
if (emailInput && emailError) {
  emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
}
if (passwordField && passwordError) {
  passwordField.addEventListener('input', () => clearFieldError(passwordField, passwordError));
}

// Register link functionality
if (registerLink) {
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Registration feature coming soon!');
  });
}

// Password visibility toggle
if (togglePasswordBtn && passwordField) {
  // default state
  togglePasswordBtn.setAttribute('aria-pressed', 'false');
  const syncToggleState = (shouldShow) => {
    passwordField.type = shouldShow ? 'text' : 'password';
    togglePasswordBtn.classList.toggle('visible', shouldShow);
    togglePasswordBtn.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');
    togglePasswordBtn.setAttribute('aria-pressed', shouldShow ? 'true' : 'false');
  };

  togglePasswordBtn.addEventListener('click', () => {
    const shouldShow = passwordField.type === 'password';
    syncToggleState(shouldShow);
  });
  // Reset state when field is cleared
  passwordField.addEventListener('input', () => {
    if (passwordField.value.length === 0) {
      syncToggleState(false);
    }
  });
}

// Forgot password placeholder action
const forgotPasswordBtn = document.getElementById('forgot-password');
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset feature coming soon!');
  });
}

// Sidebar toggle functionality
const hamburger = document.getElementById('sidebar-toggle') || document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content') || document.querySelector('.content');
const layoutContainer = document.querySelector('.layout-container');

function toggleSidebar(force) {
  if (!hamburger || !sidebar) return;
  const shouldShow = typeof force === 'boolean' ? force : !sidebar.classList.contains('show');
  sidebar.classList.toggle('show', shouldShow);
  hamburger.classList.toggle('active', shouldShow);
  if (mainContent) mainContent.classList.toggle('shifted', shouldShow);
  if (layoutContainer) layoutContainer.classList.toggle('collapsed', shouldShow);
}

if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => toggleSidebar());
}

function gotoSection(sectionId) {
  const link = document.querySelector(`.sidebar nav a[data-section="${sectionId}"]`);
  if (link) link.click();
}






function renderBookingSummary(bookings) {
  if (!bookings) return;
  renderBookingStats(bookings.stats);
  renderCurrentBookingCard(bookings.current);
  renderPlannerCard(bookings.planner);
  renderBookingsTable(bookings.list || []);
}

function renderBookingStats(stats) {
  if (!stats) return;
  setElementText('booking-active-stay-value', stats.activeStay?.value ?? '—');
  setElementText('booking-active-stay-meta', stats.activeStay?.meta ?? '');
  setElementText('booking-upcoming-stays-value', stats.upcomingStays?.value ?? '0');
  setElementText('booking-upcoming-stays-meta', stats.upcomingStays?.meta ?? '');
  setElementText('booking-upgrade-requests-value', stats.upgradeRequests?.value ?? '0');
  setElementText('booking-upgrade-requests-meta', stats.upgradeRequests?.meta ?? '');
}

function renderCurrentBookingCard(current) {
  const card = document.getElementById('booking-current-card');
  if (!card || !current) return;

  setElementText('booking-current-title', current.title || 'Current stay');

  const statusEl = document.getElementById('booking-current-status');
  if (statusEl) {
    statusEl.textContent = current.status?.label || '';
    statusEl.className = ['badge', current.status?.tone].filter(Boolean).join(' ');
  }

  renderMetaList('booking-current-meta', current.meta);
  renderPillRow('booking-current-addons', current.addons);
  renderActionButtons('booking-current-actions', current.actions);
}

function renderPlannerCard(planner) {
  const card = document.getElementById('booking-planner-card');
  if (!card || !planner) return;

  setElementText('booking-planner-title', planner.title || 'Upcoming plans');
  setElementText('booking-planner-description', planner.description || '');

  const badgeEl = document.getElementById('booking-planner-badge');
  if (badgeEl) {
    badgeEl.textContent = planner.badge?.label || '';
    badgeEl.className = ['badge', planner.badge?.tone].filter(Boolean).join(' ');
  }

  renderMetaList('booking-planner-meta', planner.meta);
  renderActionButtons('booking-planner-actions', planner.actions);
}

function renderBookingsTable(items) {
  const tbody = document.getElementById('bookings-table-body');
  const template = document.getElementById('booking-row-template');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!template || !Array.isArray(items) || !items.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'empty-state';
    cell.textContent = 'No bookings found. Start planning your next stay to see it here.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  items.forEach((item) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="id"]', item.id);
    setDomField(clone, '[data-field="suite"]', item.suite);
    setDomField(clone, '[data-field="dates"]', item.dates);

    const statusEl = clone.querySelector('[data-field="status"]');
    if (statusEl) {
      statusEl.textContent = item.status?.label || '';
      statusEl.className = ['status', item.status?.tone].filter(Boolean).join(' ');
    }

    const addonsContainer = clone.querySelector('[data-field="addons"]');
    if (addonsContainer) {
      addonsContainer.innerHTML = '';
      renderInlinePills(addonsContainer, item.addons);
    }

    const [primaryBtn, secondaryBtn] = clone.querySelectorAll('[data-action]');
    if (primaryBtn) {
      primaryBtn.textContent = item.actions?.[0]?.label || 'View';
      attachActionHandler(primaryBtn, item.actions?.[0]?.intent);
    }
    if (secondaryBtn) {
      secondaryBtn.textContent = item.actions?.[1]?.label || '';
      if (item.actions?.[1]) {
        attachActionHandler(secondaryBtn, item.actions[1].intent);
      } else {
        secondaryBtn.remove();
      }
    }

    tbody.appendChild(clone);
  });
}

function renderMetaList(containerId, items) {
  const container =
    typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(items) || !items.length) {
    const placeholder = document.createElement('li');
    placeholder.className = 'meta-empty';
    placeholder.textContent = 'Details will appear here once provided.';
    container.appendChild(placeholder);
    return;
  }

  items.forEach((entry) => {
    const item = document.createElement('li');
    const label = document.createElement('span');
    label.className = 'meta-label';
    label.textContent = entry.label || '';
    const value = document.createElement('span');
    value.textContent = entry.value || '';
    item.append(label, value);
    container.appendChild(item);
  });
}

function renderPillRow(containerId, items) {
  const container =
    typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;
  container.innerHTML = '';

  renderInlinePills(container, items);
}

function renderPaymentsSection(payments) {
  if (!payments) return;

  setElementText('payments-outstanding-value', payments.outstanding?.amount ?? '$0.00');
  setElementText('payments-outstanding-meta', payments.outstanding?.meta ?? '');
  setElementText('payments-last-value', payments.lastPayment?.amount ?? '$0.00');
  setElementText('payments-last-meta', payments.lastPayment?.meta ?? '');

  renderFinancialSummary('payments-summary', payments.summary);
  renderActionButtons('payments-summary-actions', payments.summary?.actions);
  renderMetaList('payments-methods', payments.methods?.entries);
  renderActionButtons('payments-method-actions', payments.methods?.actions);
  renderPaymentsTable(payments.recent || []);
}

function renderFinancialSummary(containerId, summary) {
  const container =
    typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  container.innerHTML = '';
  if (!summary) {
    container.textContent = 'No billing information available yet.';
    return;
  }

  const headline = document.createElement('div');
  const caption = document.createElement('p');
  caption.className = 'financial-caption';
  caption.textContent = summary.caption || '';
  const amount = document.createElement('span');
  amount.className = 'financial-balance';
  amount.textContent = summary.amount || '$0.00';
  headline.append(caption, amount);

  const meta = document.createElement('p');
  meta.className = 'financial-caption';
  meta.textContent = summary.meta || '';

  const pillRow = document.createElement('div');
  pillRow.className = 'pill-row';
  if (Array.isArray(summary.breakdown) && summary.breakdown.length) {
    summary.breakdown.forEach((item) => {
      const pill = document.createElement('span');
      pill.className = ['pill', item.tone || 'neutral'].filter(Boolean).join(' ');
      pill.textContent = `${item.label} · ${item.amount}`;
      pillRow.appendChild(pill);
    });
  }

  container.append(headline, meta, pillRow);
}

function renderPaymentsTable(items) {
  const tbody = document.getElementById('payments-table-body');
  const template = document.getElementById('payment-row-template');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!template || !Array.isArray(items) || !items.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'empty-state';
    cell.textContent = 'No transactions yet. Payments will appear once charges are posted.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  items.forEach((entry) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="reference"]', entry.reference);
    setDomField(clone, '[data-field="description"]', entry.description);
    setDomField(clone, '[data-field="date"]', entry.date);
    setDomField(clone, '[data-field="amount"]', entry.amount);

    const statusEl = clone.querySelector('[data-field="status"]');
    if (statusEl) {
      statusEl.textContent = entry.status?.label || '';
      statusEl.className = ['status', entry.status?.tone].filter(Boolean).join(' ');
    }

    const actionsContainer = clone.querySelector('[data-field="actions"]');
    if (actionsContainer) {
      renderInlineActions(actionsContainer, entry.actions);
    }

    tbody.appendChild(clone);
  });
}

function renderReceiptsSection(receipts) {
  if (!receipts) return;
  renderReceiptCards('receipts-grid', receipts.list);
  renderActionButtons('receipts-actions', receipts.actions);
}

function renderReceiptCards(containerId, items) {
  const container =
    typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  const template = document.getElementById('receipt-card-template');
  if (!container) return;

  container.innerHTML = '';

  if (!template || !Array.isArray(items) || !items.length) {
    const emptyCard = document.createElement('article');
    emptyCard.className = 'download-card';
    const message = document.createElement('p');
    message.textContent = 'No receipts generated yet. Completed payments will populate here.';
    emptyCard.appendChild(message);
    container.appendChild(emptyCard);
    return;
  }

  items.forEach((item) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="title"]', item.title);
    setDomField(clone, '[data-field="description"]', item.description);

    const badgeEl = clone.querySelector('[data-field="badge"]');
    if (badgeEl) {
      badgeEl.textContent = item.badge?.label || '';
      badgeEl.className = ['badge', item.badge?.tone].filter(Boolean).join(' ');
    }

    const metaContainer = clone.querySelector('[data-field="meta"]');
    if (metaContainer) {
      renderMetaList(metaContainer, item.meta);
    }

    const actionsContainer = clone.querySelector('[data-field="actions"]');
    if (actionsContainer) {
      renderActionButtons(actionsContainer, item.actions);
    }

    container.appendChild(clone);
  });
}

function renderInlineActions(container, actions) {
  container.innerHTML = '';
  if (!Array.isArray(actions) || !actions.length) return;

  actions.forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'action-link';
    button.textContent = action.label || 'Action';
    attachActionHandler(button, action.intent);
    container.appendChild(button);
  });
}

function renderReservationsSection(reservations) {
  if (!reservations) return;
  setElementText('reservations-week-value', reservations.stats?.week?.value ?? '0');
  setElementText('reservations-week-meta', reservations.stats?.week?.meta ?? '');
  setElementText('reservations-holds-value', reservations.stats?.holds?.value ?? '0');
  setElementText('reservations-holds-meta', reservations.stats?.holds?.meta ?? '');

  renderHeadlineCard('reservations-highlight', reservations.highlight);
  renderHeadlineCard('reservations-recommendations', reservations.recommendations, {
    copyId: 'reservations-recommendations-copy',
  });
  renderMetaList('reservations-recommendations', reservations.recommendations?.items);
  renderActionButtons(
    'reservations-recommendations-actions',
    reservations.recommendations?.actions
  );
  renderTimeline('reservations-highlight-timeline', reservations.highlight?.events);
  renderReservationTable(reservations.list || []);
}

function renderHeadlineCard(prefix, data, options = {}) {
  const titleId = `${prefix}-title`;
  const badgeId = `${prefix}-badge`;
  setElementText(titleId, data?.title || '');

  const badgeEl = document.getElementById(badgeId);
  if (badgeEl) {
    badgeEl.textContent = data?.badge?.label || '';
    badgeEl.className = ['badge', data?.badge?.tone].filter(Boolean).join(' ');
  }

  if (options.copyId) {
    setElementText(options.copyId, data?.copy || '');
  }
}

function renderTimeline(containerId, events) {
  const container =
    typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!Array.isArray(events) || !events.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'timeline-item';
    const message = document.createElement('p');
    message.textContent = 'No updates at this time.';
    placeholder.appendChild(message);
    container.appendChild(placeholder);
    return;
  }

  events.forEach((event) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    const time = document.createElement('span');
    time.className = 'timeline-time';
    time.textContent = event.time || '';
    const content = document.createElement('div');
    content.className = 'timeline-content';
    const title = document.createElement('h4');
    title.textContent = event.title || '';
    const desc = document.createElement('p');
    desc.textContent = event.description || '';
    content.append(title, desc);
    item.append(time, content);
    container.appendChild(item);
  });
}

function renderReservationTable(reservations) {
  const tbody = document.getElementById('reservations-table-body');
  const template = document.getElementById('reservation-row-template');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!template || !Array.isArray(reservations) || !reservations.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'empty-state';
    cell.textContent = 'No reservations scheduled yet. Confirm an experience to show it here.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  reservations.forEach((entry) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="experience"]', entry.experience);
    setDomField(clone, '[data-field="schedule"]', entry.schedule);
    setDomField(clone, '[data-field="guests"]', entry.guests);
    setDomField(clone, '[data-field="notes"]', entry.notes);

    const statusEl = clone.querySelector('[data-field="status"]');
    if (statusEl) {
      statusEl.textContent = entry.status?.label || '';
      statusEl.className = ['status', entry.status?.tone].filter(Boolean).join(' ');
    }

    const actionsContainer = clone.querySelector('[data-field="actions"]');
    if (actionsContainer) {
      renderInlineActions(actionsContainer, entry.actions);
    }

    tbody.appendChild(clone);
  });
}

function renderOrdersSection(orders) {
  if (!orders) return;
  setElementText('orders-active-value', orders.stats?.active?.value ?? '0');
  setElementText('orders-active-meta', orders.stats?.active?.meta ?? '');
  setElementText('orders-average-value', orders.stats?.average?.value ?? '—');
  setElementText('orders-average-meta', orders.stats?.average?.meta ?? '');

  renderHeadlineCard('orders-timeline', orders.timeline);
  renderTimeline('orders-timeline', orders.timeline?.events);
  renderActionButtons('orders-timeline-actions', orders.timeline?.actions);
  renderOrderHistory(orders.history || []);
}

function renderOrderHistory(history) {
  const tbody = document.getElementById('orders-history-body');
  const template = document.getElementById('order-history-row-template');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!template || !Array.isArray(history) || !history.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'empty-state';
    cell.textContent = 'No orders placed yet. Order dining to populate this list.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  history.forEach((entry) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="order"]', entry.order);
    setDomField(clone, '[data-field="items"]', entry.items);
    setDomField(clone, '[data-field="date"]', entry.date);
    setDomField(clone, '[data-field="total"]', entry.total);

    const statusEl = clone.querySelector('[data-field="status"]');
    if (statusEl) {
      statusEl.textContent = entry.status?.label || '';
      statusEl.className = ['status', entry.status?.tone].filter(Boolean).join(' ');
    }

    const actionsContainer = clone.querySelector('[data-field="actions"]');
    if (actionsContainer) {
      renderInlineActions(actionsContainer, entry.actions);
    }

    tbody.appendChild(clone);
  });
}

function renderSupportSection(support) {
  if (!support) return;
  setElementText('support-reply-value', support.stats?.reply?.value ?? '—');
  setElementText('support-reply-meta', support.stats?.reply?.meta ?? '');
  setElementText('support-open-value', support.stats?.open?.value ?? '0');
  setElementText('support-open-meta', support.stats?.open?.meta ?? '');

  renderHeadlineCard('support-concierge', support.concierge);
  renderMetaList('support-concierge-meta', support.concierge?.meta);
  renderActionButtons('support-concierge-actions', support.concierge?.actions);

  renderHeadlineCard('support-timeline', support.timeline);
  renderTimeline('support-timeline', support.timeline?.events);

  renderSupportChannels('support-channel-grid', support.channels);
}

function renderSupportChannels(containerId, channels) {
  const container =
    typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  const template = document.getElementById('support-channel-template');
  if (!container) return;

  container.innerHTML = '';

  if (!template || !Array.isArray(channels) || !channels.length) {
    const message = document.createElement('p');
    message.className = 'empty-state';
    message.textContent = 'Support channels will appear when available.';
    container.appendChild(message);
    return;
  }

  channels.forEach((channel) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="title"]', channel.title);
    const badgeEl = clone.querySelector('[data-field="badge"]');
    if (badgeEl) {
      badgeEl.textContent = channel.badge?.label || '';
      badgeEl.className = ['badge', channel.badge?.tone].filter(Boolean).join(' ');
    }
    setDomField(clone, '[data-field="highlight"]', channel.highlight);
    setDomField(clone, '[data-field="meta"]', channel.meta);
    setDomField(clone, '[data-field="description"]', channel.description);

    const actionsContainer = clone.querySelector('[data-field="actions"]');
    if (actionsContainer) {
      renderActionButtons(actionsContainer, channel.actions);
    }

    container.appendChild(clone);
  });
}

function renderInlinePills(container, items) {
  if (!Array.isArray(items) || !items.length) {
    const placeholder = document.createElement('span');
    placeholder.className = 'pill neutral';
    placeholder.textContent = 'No add-ons';
    container.appendChild(placeholder);
    return;
  }

  items.forEach((entry) => {
    const pill = document.createElement('span');
    pill.className = ['pill', entry?.tone || 'neutral'].filter(Boolean).join(' ');
    pill.textContent = entry?.label || '';
    container.appendChild(pill);
  });
}

function renderActionButtons(containerId, actions) {
  const container =
    typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(actions) || !actions.length) {
    return;
  }

  actions.forEach((action) => {
    const button = document.createElement('button');
    const classes = Array.isArray(action.variant) ? action.variant : ['btn', 'ghost'];
    button.className = classes.join(' ');
    button.type = action.type || 'button';
    button.textContent = action.label || 'Action';

    if (action.intent) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetFn =
          typeof action.intent.fn === 'function' ? action.intent.fn : window[action.intent.fn];
        if (typeof targetFn === 'function') {
          const args = Array.isArray(action.intent.args) ? action.intent.args : [];
          targetFn.apply(window, args);
        } else if (action.intent.message) {
          if (typeof showToast === 'function') {
            showToast(action.intent.message, 'info');
          } else {
            alert(action.intent.message);
          }
        }
      });
    }

    container.appendChild(button);
  });
}

function attachActionHandler(element, intent) {
  if (!element || !intent) return;
  element.addEventListener('click', () => {
    if (typeof intent === 'function') {
      intent();
      return;
    }

    const targetFn = typeof intent.fn === 'function' ? intent.fn : window[intent.fn];
    if (typeof targetFn === 'function') {
      const args = Array.isArray(intent.args) ? intent.args : [];
      targetFn.apply(window, args);
    } else if (intent.message) {
      if (typeof showToast === 'function') {
        showToast(intent.message, 'info');
      } else {
        alert(intent.message);
      }
    }
  });
}

function setElementText(idOrElement, value) {
  const el = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement;
  if (el) {
    el.textContent = value ?? '';
  }
}

function setDomField(root, selector, value) {
  if (!root) return;
  const target = root.querySelector(selector);
  if (target) {
    target.textContent = value ?? '';
  }
}

// ===== GLOBAL JAVASCRIPT ENHANCEMENTS =====

// Loading State Management
function showLoading(button) {
  const originalHTML = button.innerHTML;
  button.classList.add('btn-loading');
  button.innerHTML = `<span class="loading-spinner"></span> ${button.textContent}`;
  button.dataset.originalHtml = originalHTML;
}

function hideLoading(button) {
  button.classList.remove('btn-loading');
  if (button.dataset.originalHtml) {
    button.innerHTML = button.dataset.originalHtml;
  }
}

// Global Toast System
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast alert alert-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Global Modal System
window.showModal = function(title, contentHtml, onConfirm = null, confirmText = 'Create/Confirm', cancelText = 'Cancel') {
  let overlay = document.getElementById('global-modal-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    
    overlay.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 id="global-modal-title"></h3>
          <button type="button" class="modal-close" id="global-modal-close" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="global-modal-body"></div>
        <div class="modal-footer" id="global-modal-footer">
          <button type="button" class="btn btn-secondary" id="global-modal-cancel"></button>
          <button type="button" class="btn btn-primary" id="global-modal-confirm"></button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const titleEl = document.getElementById('global-modal-title');
  const bodyEl = document.getElementById('global-modal-body');
  const closeBtn = document.getElementById('global-modal-close');
  const cancelBtn = document.getElementById('global-modal-cancel');
  const confirmBtn = document.getElementById('global-modal-confirm');

  titleEl.textContent = title;
  bodyEl.innerHTML = contentHtml;
  
  cancelBtn.textContent = cancelText;
  confirmBtn.textContent = confirmText;

  const closeFn = () => {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  };

  closeBtn.onclick = closeFn;
  cancelBtn.onclick = closeFn;
  
  if (onConfirm) {
    confirmBtn.style.display = 'inline-block';
    confirmBtn.onclick = () => {
      onConfirm(closeFn);
    };
  } else {
    confirmBtn.style.display = 'none';
  }

  overlay.style.display = 'flex';
  overlay.setAttribute('aria-hidden', 'false');
};

// Confirmation Dialogs for Destructive Actions
function setupConfirmationDialogs() {
  document.querySelectorAll('.btn-danger, .cancel-btn, .delete-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      if (!this.dataset.confirmed) {
        e.preventDefault();
        e.stopPropagation();

        const originalText = this.textContent;
        const originalBg = this.style.background;

        this.textContent = 'Click again to confirm';
        this.style.background = 'var(--danger)';
        this.dataset.confirmed = 'true';

        setTimeout(() => {
          this.textContent = originalText;
          this.style.background = originalBg;
          delete this.dataset.confirmed;
        }, 3000);
      }
    });
  });
}

// Empty State Management
function checkEmptyStates() {
  document.querySelectorAll('.data-table').forEach((table) => {
    const tbody = table.querySelector('tbody');
    const emptyState = table.parentNode.querySelector('.empty-state');

    if (tbody && emptyState) {
      const hasRows = tbody.querySelectorAll('tr').length > 0;
      emptyState.classList.toggle('visible', !hasRows);
      table.style.display = hasRows ? '' : 'none';
    }
  });
}

// Form Validation Enhancement
function setupFormValidation() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function (e) {
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add('invalid');
          isValid = false;

          let errorMsg = field.parentNode.querySelector('.field-error');
          if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'field-error';
            errorMsg.style.cssText = 'color: var(--danger); font-size: 12px; margin-top: 5px;';
            field.parentNode.appendChild(errorMsg);
          }
          errorMsg.textContent = 'This field is required';
        } else {
          field.classList.remove('invalid');
          const errorMsg = field.parentNode.querySelector('.field-error');
          if (errorMsg) errorMsg.remove();
        }
      });

      if (!isValid) {
        e.preventDefault();
        this.querySelector('.form-alert')?.classList.add('visible');
      }
    });
  });
}

// Clock functionality for staff dashboard
function updateClock() {
  const clockDisplay = document.getElementById('clock-display');
  if (!clockDisplay) return;

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  clockDisplay.textContent = `${hours}:${minutes}`;
}

function cloneTemplate(id) {
  const t = document.getElementById(id);
  if (!t) return null;
  return t.content.cloneNode(true);
}


function renderRoomManagement(state) {
  const statusGrid = document.getElementById('room-status-grid');
  if (statusGrid) {
    statusGrid.innerHTML = '';
    state.statusBlocks.forEach((block) => {
      const f = cloneTemplate('room-status-block-template');
      if (!f) return;
      const h = f.querySelector('header');
      if (h) h.textContent = block.title;
      const ul = f.querySelector('[data-field="items"]');
      block.lines.forEach((line) => {
        const liFrag = cloneTemplate('room-status-line-template');
        if (!liFrag) return;
        const li = liFrag.querySelector('li');
        li.textContent = line;
        ul.appendChild(liFrag);
      });
      statusGrid.appendChild(f);
    });
  }
  const rosterBody = document.getElementById('room-roster-body');
  if (rosterBody) {
    rosterBody.innerHTML = '';
    state.roster.forEach((row) => {
      const r = cloneTemplate('room-roster-row-template');
      if (!r) return;
      r.querySelector('[data-field="room"]').textContent = row.room;
      r.querySelector('[data-field="type"]').textContent = row.type;
      r.querySelector('[data-field="status"]').textContent = row.status;
      r.querySelector('[data-field="next"]').textContent = row.next;
      r.querySelector('[data-field="assigned"]').textContent = row.assigned;
      rosterBody.appendChild(r);
    });
  }
  const notesList = document.getElementById('room-notes-list');
  if (notesList) {
    notesList.innerHTML = '';
    state.notes.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      notesList.appendChild(li);
    });
  }
}

function renderShiftBookings(items) {
  const body = document.getElementById('shift-bookings-body');
  if (!body) return;
  body.innerHTML = '';
  items.forEach((b) => {
    const row = cloneTemplate('shift-booking-row-template');
    if (!row) return;
    row.querySelector('[data-field="guest"]').textContent = b.guest;
    row.querySelector('[data-field="room"]').textContent = b.room;
    row.querySelector('[data-field="type"]').textContent = b.type;
    row.querySelector('[data-field="step"]').textContent = b.step;
    row.querySelector('[data-field="notes"]').textContent = b.notes;
    body.appendChild(row);
  });
}





function setupOfflineDetection() {
  const bannerId = 'offline-banner';
  let banner = document.getElementById(bannerId);
  function show() {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = bannerId;
      banner.textContent = 'You are offline';
      banner.style.cssText =
        'position:fixed;top:0;left:0;right:0;background:#b91c1c;color:#fff;font-size:12px;padding:6px;text-align:center;z-index:9999;';
      document.body.appendChild(banner);
    }
    banner.style.display = 'block';
  }
  function hide() {
    if (banner) banner.style.display = 'none';
  }
  if (!navigator.onLine) show();
  else hide();
  window.addEventListener('offline', show);
  window.addEventListener('online', hide);
}

function setupTouchOptimization() {
  document.querySelectorAll('button, a').forEach((el) => {
    el.style.touchAction = 'manipulation';
  });
}

function setupQuickAccessDrawer() {
  const toggle = document.getElementById('quick-access-toggle');
  const drawer = document.getElementById('quick-access-drawer');
  if (!toggle || !drawer) return;
  let lastFocus = null;
  function open() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    lastFocus = document.activeElement;
    const focusable = drawer.querySelector(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();
    else drawer.focus();
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onDocClick);
  }
  function close() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onDocClick);
    if (lastFocus) toggle.focus();
  }
  function onKeyDown(e) {
    if (e.key === 'Escape') close();
  }
  function onDocClick(e) {
    if (drawer.contains(e.target) || toggle.contains(e.target)) return;
    close();
  }
  toggle.addEventListener('click', function () {
    if (drawer.classList.contains('open')) close();
    else open();
  });
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(
      drawer.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function setupHelpBubblePulse() {
  const bubble = document.querySelector('.help-bubble');
  if (!bubble) return;
  const KEY = 'helpBubbleShown';
  try {
    const shown = localStorage.getItem(KEY);
    if (!shown) {
      bubble.classList.add('pulse');
      setTimeout(() => {
        bubble.classList.remove('pulse');
        localStorage.setItem(KEY, '1');
      }, 12000);
    }
  } catch (e) {}
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  setupConfirmationDialogs();
  setupFormValidation();
  setupOfflineDetection();
  setupTouchOptimization();
  setupQuickAccessDrawer();
  setupHelpBubblePulse();
  checkEmptyStates();

  // Initialize staff dashboard if on staff page
  if (document.body.classList.contains('staff-dashboard')) {
    initialiseStaffDashboard();
  }

  // Initialize admin dashboard if on admin page
  if (document.body.classList.contains('admin-dashboard')) {
    initialiseAdminDashboard();
  }

  // Initialize customer dashboard if on customer page
  if (document.body.classList.contains('customer-dashboard')) {
    initialiseCustomerDashboard();
  }

  if (document.body.classList.contains('page-login')) {
    try {
      const remembered = localStorage.getItem('remember') === '1' || localStorage.getItem('keepSignedIn') === '1';
      const raw = localStorage.getItem('session_user');
      if (remembered && raw) {
        const u = JSON.parse(raw);
        const role = (u && u.user_type) || 'customer';
        const target = DASHBOARD_TARGETS[role] || DASHBOARD_TARGETS.customer;
        const href = preferStaticDashboards ? target.static : target.dynamic;
        window.location.href = href;
      }
    } catch (_) {}
    wireSocialLogin();
  }

  // Add loading states to all form submissions
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function () {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) showLoading(submitBtn);
    });
  });
});

function wireSocialLogin() {
  let apiBase = (typeof window.API_BASE_URL === 'string' && window.API_BASE_URL)
    ? window.API_BASE_URL
    : '';
  if (!apiBase) {
    const parts = window.location.pathname.split('/');
    const baseDir = parts.slice(0, -1).join('/') || '';
    apiBase = window.location.origin + baseDir + '/api';
    if (apiBase.startsWith('file://')) apiBase = 'http://localhost/api';
  }
  const g = document.querySelector('.social-btn.google');
  const f = document.querySelector('.social-btn.facebook');
  const t = document.querySelector('.social-btn.apple');
  const open = (url) => window.open(url, 'oauth_popup', 'width=500,height=650');
  if (g) g.addEventListener('click', () => open(apiBase + '/auth/oauth/google/start'));
  if (f) f.addEventListener('click', () => open(apiBase + '/auth/oauth/facebook/start'));
  if (t) t.addEventListener('click', () => open(apiBase + '/auth/oauth/twitter/start'));
  window.addEventListener('message', (e) => {
    const d = e && e.data;
    if (!d || d.type !== 'oauth' || d.status !== 'success') return;
    const user = d.data && d.data.user;
    if (user) {
      try { localStorage.setItem('session_user', JSON.stringify(user)); } catch (_) {}
      try { localStorage.setItem('keepSignedIn', '1'); } catch (_) {}
      try { localStorage.setItem('remember', '1'); } catch (_) {}
    }
    const role = (user && user.user_type) || 'customer';
    const target = DASHBOARD_TARGETS[role] || DASHBOARD_TARGETS.customer;
    const href = preferStaticDashboards ? target.static : target.dynamic;
    window.location.href = href;
  });
}

function wireSocialModal() {}

function openSocialModal(provider) {}

function closeSocialModal() {}

function selectSocialAccount() {}

function ensureOtherAccountRow() { return null; }














