/**
 * Booking System JavaScript - Champion Hotel Management System
 * Handles multi-step booking process with real-time availability
 */

// ============================================
// STATE MANAGEMENT
// ============================================
const bookingState = {
  currentStep: 1,
  checkInDate: null,
  checkOutDate: null,
  guests: 2,
  selectedRoom: null,
  guestDetails: {},
  availableRooms: []
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  steps: document.querySelectorAll('.booking-step'),
  progressSteps: document.querySelectorAll('.step'),
  checkInInput: document.getElementById('check-in-date'),
  checkOutInput: document.getElementById('check-out-date'),
  guestsSelect: document.getElementById('guests'),
  durationDisplay: document.getElementById('duration-display'),
  roomsGrid: document.getElementById('rooms-grid'),
  loadingRooms: document.getElementById('loading-rooms'),
  noRooms: document.getElementById('no-rooms'),
  guestForm: document.getElementById('guest-details-form'),
  termsCheckbox: document.getElementById('terms-checkbox'),
  toastContainer: document.getElementById('toast-container')
};

// Navigation buttons
const navButtons = {
  nextToRooms: document.getElementById('next-to-rooms'),
  backToDates: document.getElementById('back-to-dates'),
  nextToDetails: document.getElementById('next-to-details'),
  backToRooms: document.getElementById('back-to-rooms'),
  nextToConfirm: document.getElementById('next-to-confirm'),
  backToDetails: document.getElementById('back-to-details'),
  confirmBooking: document.getElementById('confirm-booking')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initializeDateInputs();
  attachEventListeners();
});

/**
 * Initialize date inputs with minimum dates
 */
function initializeDateInputs() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  elements.checkInInput.min = formatDate(today);
  elements.checkOutInput.min = formatDate(tomorrow);
  const params = new URLSearchParams(window.location.search);
  const ci = params.get('check_in');
  const co = params.get('check_out');
  const g = params.get('guests');
  const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
  if (isDate(ci)) {
    elements.checkInInput.value = ci;
  } else {
    elements.checkInInput.value = formatDate(today);
  }
  const minCheckOut = new Date(elements.checkInInput.value);
  minCheckOut.setDate(minCheckOut.getDate() + 1);
  elements.checkOutInput.min = formatDate(minCheckOut);
  if (isDate(co)) {
    elements.checkOutInput.value = co;
  } else {
    elements.checkOutInput.value = formatDate(tomorrow);
  }
  if (g && elements.guestsSelect) {
    elements.guestsSelect.value = String(g);
  }
  updateDuration();
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // Date inputs
  elements.checkInInput.addEventListener('change', handleCheckInChange);
  elements.checkOutInput.addEventListener('change', handleCheckOutChange);
  elements.guestsSelect.addEventListener('change', updateDuration);
  
  // Navigation buttons
  navButtons.nextToRooms.addEventListener('click', () => validateAndProceed(1, 2));
  navButtons.backToDates.addEventListener('click', () => goToStep(1));
  navButtons.nextToDetails.addEventListener('click', () => goToStep(3));
  navButtons.backToRooms.addEventListener('click', () => goToStep(2));
  navButtons.nextToConfirm.addEventListener('click', () => validateGuestDetails());
  navButtons.backToDetails.addEventListener('click', () => goToStep(3));
  navButtons.confirmBooking.addEventListener('click', submitBooking);
  
  // Terms checkbox
  if (elements.termsCheckbox) {
    elements.termsCheckbox.addEventListener('change', (e) => {
      navButtons.confirmBooking.disabled = !e.target.checked;
    });
  }
  
  // Guest form validation
  const formInputs = elements.guestForm.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

// ============================================
// DATE HANDLING
// ============================================
/**
 * Handle check-in date change
 */
function handleCheckInChange() {
  const checkIn = new Date(elements.checkInInput.value);
  const checkOut = new Date(elements.checkOutInput.value);
  
  // Update minimum check-out date
  const minCheckOut = new Date(checkIn);
  minCheckOut.setDate(minCheckOut.getDate() + 1);
  elements.checkOutInput.min = formatDate(minCheckOut);
  
  // Adjust check-out if it's before new minimum
  if (checkOut <= checkIn) {
    elements.checkOutInput.value = formatDate(minCheckOut);
  }
  
  updateDuration();
}

/**
 * Handle check-out date change
 */
function handleCheckOutChange() {
  updateDuration();
}

/**
 * Update duration display
 */
function updateDuration() {
  const checkIn = new Date(elements.checkInInput.value);
  const checkOut = new Date(elements.checkOutInput.value);
  
  if (checkIn && checkOut && checkOut > checkIn) {
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    elements.durationDisplay.textContent = `${nights} night${nights > 1 ? 's' : ''}`;
    
    bookingState.checkInDate = elements.checkInInput.value;
    bookingState.checkOutDate = elements.checkOutInput.value;
    bookingState.guests = parseInt(elements.guestsSelect.value);
  } else {
    elements.durationDisplay.textContent = 'Select dates';
  }
}

// ============================================
// STEP NAVIGATION
// ============================================
/**
 * Validate current step and proceed to next
 */
async function validateAndProceed(currentStep, nextStep) {
  if (currentStep === 1) {
    if (!validateDates()) {
      showToast('Please select valid check-in and check-out dates', 'error');
      return;
    }
    
    // Load available rooms
    await loadAvailableRooms();
  }
  
  goToStep(nextStep);
}

/**
 * Navigate to a specific step
 */
function goToStep(stepNumber) {
  // Hide all steps
  elements.steps.forEach(step => {
    step.style.display = 'none';
  });
  
  // Show target step
  const targetStep = document.getElementById(`step-${stepNumber}`);
  if (targetStep) {
    targetStep.style.display = 'block';
  }
  
  // Update progress indicators
  elements.progressSteps.forEach((step, index) => {
    const stepNum = index + 1;
    step.classList.remove('active', 'completed');
    
    if (stepNum < stepNumber) {
      step.classList.add('completed');
    } else if (stepNum === stepNumber) {
      step.classList.add('active');
    }
  });
  
  bookingState.currentStep = stepNumber;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ROOM LOADING & SELECTION
// ============================================
/**
 * Load available rooms from server
 */
async function loadAvailableRooms() {
  elements.loadingRooms.style.display = 'block';
  elements.roomsGrid.style.display = 'none';
  elements.noRooms.style.display = 'none';
  
  try {
    // Simulate API call - replace with actual endpoint
    const rooms = await fetchAvailableRooms();
    
    if (rooms.length === 0) {
      elements.loadingRooms.style.display = 'none';
      elements.noRooms.style.display = 'block';
      return;
    }
    
    bookingState.availableRooms = rooms;
    renderRooms(rooms);
    
    elements.loadingRooms.style.display = 'none';
    elements.roomsGrid.style.display = 'grid';
  } catch (error) {
    console.error('Error loading rooms:', error);
    showToast('Failed to load available rooms. Please try again.', 'error');
    elements.loadingRooms.style.display = 'none';
    elements.noRooms.style.display = 'block';
  }
}

/**
 * Fetch available rooms (mock implementation)
 */
async function fetchAvailableRooms() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock room data
  return [
    {
      id: 1,
      room_number: '101',
      room_type: 'Deluxe Suite',
      rate: 15000,
      features: ['King Bed', 'Ocean View', 'Balcony', 'Mini Bar'],
      image: 'Imgs/champ 3.jpeg'
    },
    {
      id: 2,
      room_number: '201',
      room_type: 'Executive Suite',
      rate: 20000,
      features: ['King Bed', 'City View', 'Jacuzzi', 'Work Desk'],
      image: 'Imgs/champ 4.jpeg'
    },
    {
      id: 3,
      room_number: '301',
      room_type: 'Presidential Suite',
      rate: 35000,
      features: ['2 Bedrooms', 'Panoramic View', 'Private Pool', 'Butler Service'],
      image: 'Imgs/champ 5.jpeg'
    },
    {
      id: 4,
      room_number: '102',
      room_type: 'Standard Room',
      rate: 8000,
      features: ['Queen Bed', 'Garden View', 'WiFi', 'TV'],
      image: 'Imgs/champ 6.jpeg'
    }
  ];
}

/**
 * Render rooms in grid
 */
function renderRooms(rooms) {
  elements.roomsGrid.innerHTML = rooms.map(room => `
    <div class="room-card" data-room-id="${room.id}" onclick="selectRoom(${room.id})">
      <img src="${room.image}" alt="${room.room_type}" class="room-image" onerror="this.src='Imgs/champion.jpeg'">
      <div class="room-details">
        <h3 class="room-type">${room.room_type}</h3>
        <div class="room-features">
          ${room.features.map(feature => `<span class="room-feature">• ${feature}</span>`).join('')}
        </div>
        <div class="room-price">
          <span class="price-label">Per Night</span>
          <span class="price-value">KSh ${room.rate.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Select a room
 */
function selectRoom(roomId) {
  // Remove previous selection
  document.querySelectorAll('.room-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Add selection to clicked room
  const selectedCard = document.querySelector(`[data-room-id="${roomId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  // Update state
  bookingState.selectedRoom = bookingState.availableRooms.find(r => r.id === roomId);
  
  // Enable next button
  navButtons.nextToDetails.disabled = false;
  
  showToast(`Selected ${bookingState.selectedRoom.room_type}`, 'success');
}

// ============================================
// GUEST DETAILS VALIDATION
// ============================================
/**
 * Validate guest details form
 */
function validateGuestDetails() {
  const fullName = document.getElementById('full-name');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const idNumber = document.getElementById('id-number');
  
  let isValid = true;
  
  // Validate full name
  if (!fullName.value.trim()) {
    showFieldError(fullName, 'Full name is required');
    isValid = false;
  } else if (fullName.value.trim().length < 3) {
    showFieldError(fullName, 'Please enter your full name');
    isValid = false;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showFieldError(email, 'Email is required');
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    showFieldError(email, 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate phone
  if (!phone.value.trim()) {
    showFieldError(phone, 'Phone number is required');
    isValid = false;
  } else if (phone.value.trim().length < 10) {
    showFieldError(phone, 'Please enter a valid phone number');
    isValid = false;
  }
  
  // Validate ID number
  if (!idNumber.value.trim()) {
    showFieldError(idNumber, 'ID/Passport number is required');
    isValid = false;
  }
  
  if (isValid) {
    // Save guest details
    bookingState.guestDetails = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      idNumber: idNumber.value.trim(),
      specialRequests: document.getElementById('special-requests').value.trim()
    };
    
    // Populate confirmation page
    populateConfirmation();
    goToStep(4);
  } else {
    showToast('Please fix the errors in the form', 'error');
  }
}

/**
 * Validate individual field
 */
function validateField(input) {
  const value = input.value.trim();
  const id = input.id;
  
  if (input.required && !value) {
    showFieldError(input, 'This field is required');
    return false;
  }
  
  if (id === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      showFieldError(input, 'Please enter a valid email address');
      return false;
    }
  }
  
  clearFieldError(input);
  return true;
}

/**
 * Show field error
 */
function showFieldError(input, message) {
  const errorId = input.id + '-error';
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  input.classList.add('error');
}

/**
 * Clear field error
 */
function clearFieldError(input) {
  const errorId = input.id + '-error';
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
  
  input.classList.remove('error');
}

// ============================================
// CONFIRMATION
// ============================================
/**
 * Populate confirmation page
 */
function populateConfirmation() {
  const checkIn = new Date(bookingState.checkInDate);
  const checkOut = new Date(bookingState.checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const roomCharges = bookingState.selectedRoom.rate * nights;
  const tax = roomCharges * 0.16;
  const total = roomCharges + tax;
  
  // Booking details
  document.getElementById('confirm-checkin').textContent = formatDateDisplay(checkIn);
  document.getElementById('confirm-checkout').textContent = formatDateDisplay(checkOut);
  document.getElementById('confirm-duration').textContent = `${nights} night${nights > 1 ? 's' : ''}`;
  document.getElementById('confirm-guests').textContent = bookingState.guests;
  
  // Room details
  document.getElementById('confirm-room-type').textContent = bookingState.selectedRoom.room_type;
  document.getElementById('confirm-room-number').textContent = bookingState.selectedRoom.room_number;
  document.getElementById('confirm-rate').textContent = `KSh ${bookingState.selectedRoom.rate.toLocaleString()}`;
  
  // Guest information
  document.getElementById('confirm-name').textContent = bookingState.guestDetails.fullName;
  document.getElementById('confirm-email').textContent = bookingState.guestDetails.email;
  document.getElementById('confirm-phone').textContent = bookingState.guestDetails.phone;
  
  // Price summary
  document.getElementById('confirm-room-charges').textContent = `KSh ${roomCharges.toLocaleString()}`;
  document.getElementById('confirm-tax').textContent = `KSh ${tax.toLocaleString()}`;
  document.getElementById('confirm-total').textContent = `KSh ${total.toLocaleString()}`;
}

// ============================================
// BOOKING SUBMISSION
// ============================================
/**
 * Submit booking to server
 */
async function submitBooking() {
  if (!elements.termsCheckbox.checked) {
    showToast('Please accept the terms and conditions', 'error');
    return;
  }
  
  // Set loading state
  navButtons.confirmBooking.classList.add('loading');
  navButtons.confirmBooking.disabled = true;
  const spinner = navButtons.confirmBooking.querySelector('.loading-spinner');
  if (spinner) spinner.style.display = 'inline-block';
  
  try {
    // Simulate API call
    const bookingReference = await submitBookingToServer();
    
    // Show success
    document.getElementById('booking-reference').textContent = bookingReference;
    goToStep('success');
    
    showToast('Booking confirmed successfully!', 'success');
  } catch (error) {
    console.error('Booking error:', error);
    showToast('Failed to confirm booking. Please try again.', 'error');
  } finally {
    navButtons.confirmBooking.classList.remove('loading');
    navButtons.confirmBooking.disabled = false;
    if (spinner) spinner.style.display = 'none';
  }
}

/**
 * Submit booking to server (mock implementation)
 */
async function submitBookingToServer() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate booking reference
  const reference = 'CHM' + Date.now().toString().slice(-8);
  
  // In real implementation, send data to server
  console.log('Booking data:', {
    ...bookingState,
    reference
  });
  
  return reference;
}

// ============================================
// VALIDATION HELPERS
// ============================================
/**
 * Validate dates
 */
function validateDates() {
  const checkIn = new Date(elements.checkInInput.value);
  const checkOut = new Date(elements.checkOutInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (checkIn < today) {
    return false;
  }
  
  if (checkOut <= checkIn) {
    return false;
  }
  
  return true;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
/**
 * Format date for input (YYYY-MM-DD)
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display
 */
function formatDateDisplay(date) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast alert alert-${type}`;
  toast.textContent = message;
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make selectRoom available globally
window.selectRoom = selectRoom;