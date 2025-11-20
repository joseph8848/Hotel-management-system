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
  admin: { static: 'dashboard_admin.html', dynamic: 'dashboard_admin.php' },
  staff: { static: 'dashboard_staff.html', dynamic: 'dashboard_staff.php' },
  customer: { static: 'dashboard_customer.html', dynamic: 'dashboard_customer.php' },
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

// Function to update form elements based on user type
function updateFormForUserType(userType) {
  if (userType === 'staff') {
    if (usernameInput) { usernameInput.style.display = 'block'; usernameInput.required = true; }
    if (emailInput) { emailInput.style.display = 'none'; emailInput.required = false; }
    if (loginBtn) loginBtn.textContent = 'Login as Staff';
    if (portalTitle) portalTitle.textContent = 'Staff Portal';
    if (portalDesc) portalDesc.textContent = 'Access your work dashboard';
    if (registerLink) registerLink.style.display = 'none';
  } else if (userType === 'admin') {
    if (usernameInput) { usernameInput.style.display = 'block'; usernameInput.required = true; }
    if (emailInput) { emailInput.style.display = 'none'; emailInput.required = false; }
    if (loginBtn) loginBtn.textContent = 'Login as Admin';
    if (portalTitle) portalTitle.textContent = 'Admin Portal';
    if (portalDesc) portalDesc.textContent = 'Manage hotel operations';
    if (registerLink) registerLink.style.display = 'none';
  } else {
    // Default to customer
    if (usernameInput) { usernameInput.style.display = 'none'; usernameInput.required = false; }
    if (emailInput) { emailInput.style.display = 'block'; emailInput.required = true; }
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

const staffDashboardState = {
  profile: {
    name: 'Alex Johnson',
    role: 'frontdesk',
    roleLabel: 'Front Desk',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    ext: '214',
  },
  assignments: {
    frontdesk: [
      {
        role: 'Front Desk',
        status: { label: 'Due 09:50', tone: 'priority-medium' },
        title: 'Welcome Rivera family',
        description: 'Prepare key packets and welcome amenities for connecting suites 706 & 708.',
        meta: [
          '👤 Assigned to Alex Johnson',
          '📞 Airport transfer confirmed · ETA 10:40',
        ],
        actions: [
          { label: 'Checklist', variant: ['pill-btn'], intent: { message: 'Opening guest checklist…' } },
          { label: 'Reassign', variant: ['pill-btn', 'ghost'], intent: { message: 'Prompting assignment dialog…' } },
        ],
      },
      {
        role: 'Front Desk',
        status: { label: 'Due 10:30', tone: 'priority-low' },
        title: 'Prepare late checkout folio',
        description: 'Finalize folio for room 305 and arrange transport voucher for 11:15 departure.',
        meta: [
          '💳 Balance $220 · Card on file',
          '🕓 Guest confirmed lobby pickup 11:05',
        ],
        actions: [
          { label: 'View folio', variant: ['pill-btn'], intent: { message: 'Opening folio viewer…' } },
          { label: 'Send reminder', variant: ['pill-btn', 'ghost'], intent: { message: 'Sending SMS reminder…' } },
        ],
      },
    ],
    housekeeping: [
      {
        role: 'Housekeeping',
        status: { label: 'Due 10:15', tone: 'priority-high' },
        title: 'Suite 804 refresh',
        description: 'Deep clean with turndown setup and floral amenity for honeymoon guests.',
        meta: [
          '🧹 Assigned to Tessa K.',
          '🌸 Amenities delivered to service closet',
        ],
        actions: [
          { label: 'Start task', variant: ['pill-btn'], intent: { message: 'Marking task in progress…' } },
          { label: 'Mark done', variant: ['pill-btn', 'ghost'], intent: { message: 'Marking task complete…' } },
        ],
      },
    ],
    kitchen: [
      {
        role: 'Kitchen',
        status: { label: 'Due 11:20', tone: 'priority-high' },
        title: 'Conference brunch prep',
        description: '12 vegetarian plates · confirm allergy tags and stage warmers for Horizon room.',
        meta: [
          '👩‍🍳 Assigned to Prep Team A',
          '📦 Ingredient check completed 08:15',
        ],
        actions: [
          { label: 'View order', variant: ['pill-btn'], intent: { message: 'Opening banquet order…' } },
          { label: 'Notify floor', variant: ['pill-btn', 'ghost'], intent: { message: 'Alerting banquet manager…' } },
        ],
      },
    ],
    maintenance: [
      {
        role: 'Maintenance',
        status: { label: 'Due 09:45', tone: 'priority-high' },
        title: 'AC airflow Rm 217',
        description: 'Replace clogged filter and run diagnostics · guest reported weak cooling.',
        meta: [
          '🛠️ Assigned to Samuel O.',
          '📋 Parts kit M-Filter-12 staged at engineering',
        ],
        actions: [
          { label: 'Start ticket', variant: ['pill-btn'], intent: { message: 'Starting maintenance ticket…' } },
          { label: 'Resolved', variant: ['pill-btn', 'ghost'], intent: { message: 'Closing maintenance ticket…' } },
        ],
      },
    ],
  },
  snapshots: [
    {
      title: 'Arrivals due',
      trend: { label: '▲ 3 today', tone: 'positive' },
      metric: '14',
      actions: [
        { label: 'Check-in board', intent: { message: 'Opening arrivals dashboard…' } },
        { label: 'Assign rooms', intent: { message: 'Launching room assignment tool…' } },
      ],
    },
    {
      title: 'Departures today',
      trend: { label: 'On track', tone: 'neutral' },
      metric: '9',
      actions: [
        { label: 'Prepare bills', intent: { message: 'Compiling departure folios…' } },
        { label: 'Arrange transport', intent: { message: 'Scheduling transport desk…' } },
      ],
    },
    {
      title: 'Room service queue',
      trend: { label: '▼ 2 delayed', tone: 'negative' },
      metric: '6',
      actions: [
        { label: 'Notify kitchen', intent: { message: 'Notifying line cooks…' } },
        { label: 'Update guest', intent: { message: 'Opening guest messaging…' } },
      ],
    },
    {
      title: 'Payments pending',
      trend: { label: '$820 due now', tone: 'warning' },
      metric: '$2.4k',
      actions: [
        { label: 'Collect deposit', intent: { message: 'Requesting payment authorization…' } },
        { label: 'Send reminder', intent: { message: 'Sending billing reminder…' } },
      ],
    },
  ],
  actionHub: [
    {
      title: 'Room assignment',
      badge: { label: 'Live inventory', tone: 'subtle' },
      fields: [
        { type: 'input', label: 'Guest or booking #', placeholder: 'Search name or REF123', required: true },
        { type: 'input', label: 'Room number', placeholder: 'e.g. 512', required: true },
      ],
      actions: [
        { label: 'Assign room', tone: 'primary', intent: { message: 'Assigning room…' } },
        { label: 'Find available', tone: 'ghost', intent: { message: 'Searching inventory…' } },
      ],
      quickLinks: [
        { label: 'Swap rooms', intent: { message: 'Opening swap workflow…' } },
        { label: 'Place room on hold', intent: { message: 'Holding selected room…' } },
      ],
    },
    {
      title: 'Booking management',
      badge: { label: 'Stay changes', tone: 'warning' },
      fields: [
        { type: 'input', label: 'Booking reference', placeholder: 'REF12345', required: true },
        { type: 'textarea', label: 'Notes for record', placeholder: 'Add reason or guest notes' },
      ],
      actions: [
        { label: 'Cancel booking', tone: 'danger', intent: { message: 'Cancelling booking…' } },
        { label: 'Extend stay', tone: 'ghost', intent: { message: 'Extending stay…' } },
      ],
      quickLinks: [
        { label: 'Resend confirmation', intent: { message: 'Sending confirmation email…' } },
        { label: 'Apply comp / upgrade', intent: { message: 'Opening comp workflow…' } },
      ],
    },
    {
      title: 'Guest services',
      badge: { label: 'Concierge tools', tone: 'success' },
      fields: [
        {
          type: 'select',
          label: 'Service type',
          options: [
            { value: 'spa', label: 'Spa appointment' },
            { value: 'dining', label: 'Dining reservation' },
            { value: 'transport', label: 'Airport transfer' },
            { value: 'house-car', label: 'House car' },
          ],
          required: true,
        },
        { type: 'datetime', label: 'Preferred time', required: true },
        { type: 'textarea', label: 'Special instructions', placeholder: 'Allergies, VIP notes, etc.' },
      ],
      actions: [
        { label: 'Schedule service', tone: 'primary', intent: { message: 'Scheduling service…' } },
        { label: 'Request follow-up', tone: 'ghost', intent: { message: 'Notifying concierge…' } },
      ],
      quickLinks: [
        { label: 'View spa availability', intent: { message: 'Opening spa calendar…' } },
        { label: 'Hand off to concierge', intent: { message: 'Starting concierge hand-off…' } },
      ],
    },
  ],
  arrivals: [
    {
      type: 'arrival',
      guest: 'Jane Smith',
      room: 'Rm 101',
      details: [
        { label: 'ETA', value: '09:30' },
        { label: 'Notes', value: 'VIP • 2 nights' },
      ],
      status: { label: 'Arriving', tone: 'checkin' },
      actions: [
        { label: 'Start', intent: { message: 'Starting check-in flow…' } },
      ],
    },
    {
      type: 'departure',
      guest: 'Michael Johnson',
      room: 'Rm 305',
      details: [
        { label: 'Checkout', value: '11:00' },
        { label: 'Balance', value: '$220' },
      ],
      status: { label: 'Departing', tone: 'checkout' },
      actions: [
        { label: 'Bill', intent: { message: 'Preparing billing summary…' } },
      ],
    },
    {
      type: 'arrival',
      guest: 'Ahmed Khan',
      room: 'Rm 217',
      details: [
        { label: 'ETA', value: '10:15' },
        { label: 'Notes', value: 'Late arrival noted' },
      ],
      status: { label: 'Arriving', tone: 'checkin' },
      actions: [
        { label: 'Assign', intent: { message: 'Assigning room…' } },
      ],
    },
    {
      type: 'departure',
      guest: 'Laura Chen',
      room: 'Rm 408',
      details: [
        { label: 'Checkout', value: '09:45' },
        { label: 'Notes', value: 'Airport transfer' },
      ],
      status: { label: 'Departing', tone: 'checkout' },
      actions: [
        { label: 'Confirm', intent: { message: 'Confirming transfer…' } },
      ],
    },
  ],
  activity: {
    columns: [
      {
        type: 'timeline',
        title: 'Front desk log',
        timeline: [
          '08:42 • Completed check-in for Parker family (Rm 706)',
          '08:20 • Logged maintenance request for AC issue in Rm 512',
          '07:55 • Confirmed airport pickup for Laura Chen',
        ],
      },
      {
        type: 'tasks',
        title: 'Service alerts',
        tasks: [
          { tone: 'high', headline: 'Escalated guest support', description: 'Rm 305 requested late checkout • Await manager approval' },
          { tone: 'medium', headline: 'Maintenance follow-up', description: 'Rm 217 shower pressure fix scheduled at 14:00' },
          { tone: 'low', headline: 'Welcome amenity', description: 'Deliver honeymoon package to Rm 819 before 16:00' },
        ],
      },
      {
        type: 'notes',
        title: 'Shift notes',
        notes: [
          '📝 Concierge covering lobby from 11:00–12:00',
          '☕ Coffee machine maintenance at 13:30 (10 min downtime)',
          '🚌 Group tour returning at 17:15 – prep welcome drinks',
        ],
      },
    ],
  },
  roles: {
    housekeeping: {
      assignments: 'housekeeping',
      snapshots: [
        { title: 'Rooms awaiting turnover', trend: { label: '8 priority', tone: 'warning' }, metric: '18', actions: [{ label: 'View roster', intent: { message: 'Opening turnover roster…' } }] },
        { title: 'Inspections today', trend: { label: 'On track', tone: 'positive' }, metric: '12', actions: [{ label: 'Inspection route', intent: { message: 'Viewing inspection plan…' } }] },
        { title: 'Linen stock', trend: { label: 'Next delivery 15:00', tone: 'neutral' }, metric: '92%', actions: [{ label: 'Restock log', intent: { message: 'Opening restock log…' } }] },
      ],
      turnover: [
        'Turnover priority · Levels 3 & 5',
        'Inspections due · Rooms 204, 305, 407, 612',
        'Linen status · Stock sufficient • Next delivery 15:00',
        'Special requests · Rm 318 hypoallergenic • Rm 411 crib',
      ],
    },
    kitchen: {
      assignments: 'kitchen',
      snapshots: [
        { title: 'Orders in queue', trend: { label: '2 delayed', tone: 'warning' }, metric: '11', actions: [{ label: 'Ticket screen', intent: { message: 'Opening kitchen ticket view…' } }] },
        { title: 'Chef stations ready', trend: { label: 'All staffed', tone: 'positive' }, metric: '5', actions: [{ label: 'Shift notes', intent: { message: 'Viewing culinary shift notes…' } }] },
        { title: 'Allergens flagged', trend: { label: '4 alerts', tone: 'negative' }, metric: '9', actions: [{ label: 'Review tags', intent: { message: 'Opening allergen tracker…' } }] },
      ],
      capacity: [
        'Kitchen · Operating at 65% capacity',
        'Pastry · Next batch ready in 18 minutes',
        'Banquets · Conference brunch plating at 11:15',
        'Room service runners · 2 available • 1 on delivery',
      ],
    },
    maintenance: {
      assignments: 'maintenance',
      snapshots: [
        { title: 'Open tickets', trend: { label: '2 urgent', tone: 'warning' }, metric: '7', actions: [{ label: 'Ticket board', intent: { message: 'Opening maintenance board…' } }] },
        { title: 'Preventive tasks today', trend: { label: 'On schedule', tone: 'positive' }, metric: '5', actions: [{ label: 'Maintenance plan', intent: { message: 'Viewing preventive plan…' } }] },
        { title: 'Parts inventory', trend: { label: '3 low items', tone: 'neutral' }, metric: '87%', actions: [{ label: 'Order supplies', intent: { message: 'Preparing supply order…' } }] },
      ],
      inspections: [
        '🏊 Pool pump audit • Today 16:00 • Technician: Marco',
        '⚡ Electrical room check • Tomorrow 08:30 • Lockout required',
        '🚿 Boiler flush • Tomorrow 11:00 • Coordinate with engineering',
      ],
    },
  },
  rooms: {
    statusBlocks: [
      {
        title: 'Vacant & clean',
        lines: [
          'Standard · 105, 107, 214, 305, 409',
          'Deluxe · 512, 514',
          'Suites · Horizon (PH1)',
        ],
      },
      {
        title: 'Currently occupied',
        lines: [
          'Standard · 102, 108, 211, 223, 315',
          'Deluxe · 401, 403, 507, 610',
          'Suites · Skyline (PH2), Garden Loft',
        ],
      },
      {
        title: 'Turnover in progress',
        lines: [
          '305 · VIP arrival at 12:00',
          '318 · Late checkout 11:30',
          '624 · Deep clean underway',
        ],
      },
      {
        title: 'Maintenance holds',
        lines: [
          '217 · AC airflow issue · Tech 10:00',
          '508 · Shower valve replacement · Parts ordered',
          '811 · Balcony rail inspection · ETA 16:00',
        ],
      },
    ],
    roster: [
      { room: '101', type: 'Standard', status: 'Vacant clean', next: 'Ready for walk-in', assigned: '—' },
      { room: '214', type: 'Standard', status: 'Occupied', next: 'Guest checkout 11:00', assigned: '—' },
      { room: '305', type: 'Deluxe', status: 'Turnover', next: 'VIP setup by 12:00', assigned: 'Maria L.' },
      { room: '407', type: 'Suite', status: 'Occupied', next: 'Turndown 19:00', assigned: 'Evening team' },
      { room: '512', type: 'Deluxe', status: 'Vacant clean', next: 'Hold for 15:00 arrival', assigned: '—' },
      { room: '624', type: 'Standard', status: 'Turnover', next: 'Deep clean 10:30', assigned: 'Omar R.' },
      { room: '811', type: 'Suite', status: 'Maintenance', next: 'Railing inspection', assigned: 'Maintenance' },
    ],
    notes: [
      'Turnover priority · Levels 3 & 5 (conference block)',
      'Inspections due · 204, 305, 407, 612',
      'Linen status · Stock sufficient • Next delivery 15:00',
      'Guest requests · 318 hypoallergenic • 411 crib • 706 playpen',
    ],
  },
  shiftBookings: [
    { guest: 'Jane Smith', room: '101', type: 'Arrival', step: 'Check-in 09:30', notes: 'VIP • Welcome drinks ready' },
    { guest: 'Parker Family', room: '706', type: 'Arrival', step: 'Check-in 11:00', notes: 'Connecting rooms • Kids amenities' },
    { guest: 'Ahmed Khan', room: '217', type: 'Arrival', step: 'ETA 10:15', notes: 'Notify maintenance once cleared' },
    { guest: 'Michael Johnson', room: '305', type: 'Departure', step: 'Checkout 11:00', notes: 'Balance $220 • Late checkout review' },
    { guest: 'Laura Chen', room: '408', type: 'Departure', step: 'Checkout 09:45', notes: 'Airport transfer 10:00' },
  ],
  upcomingReservations: [
    { summary: 'Nov 3 • Rivera Family • Suite 910', details: 'Birthday package • Early check-in 13:00' },
    { summary: 'Nov 4 • Green Corp • 5 Deluxe rooms', details: 'Conference block • Shuttle 18:30' },
    { summary: 'Nov 5 • Sarah Patel • Room 802', details: 'Loyalty platinum • Prefers quiet wing' },
    { summary: 'Nov 6 • Bridal Party • Skyline Suite', details: 'Pre-arrival styling • Champagne 17:00' },
    { summary: 'Nov 7 • Tech Expo • 12 rooms', details: 'Hybrid payment • Meeting room B reserved' },
  ],
  loyaltyGuests: [
    '👑 Sarah Patel • 18 stays • Prefers quiet wing',
    '🌿 Green Corp • 12 bookings • Sustainability plan active',
    '🎉 Rivera Family • 7 stays • Booked family suite for Dec',
  ],
  orders: {
    capacity: [
      'Kitchen · Operating at 65% capacity',
      'Spa · Next slot available 14:30',
      'Concierge · 2 transfers scheduled • 1 pending confirmation',
    ],
    queue: [
      {
        title: 'ORD-104 • Rm 512',
        meta: ['Pasta Primavera', 'Requested 09:05'],
        status: { label: 'Ready', tone: 'ready' },
        actions: [{ label: 'Deliver', intent: { message: 'Marking delivery…' } }],
      },
      {
        title: 'ORD-105 • Rm 318',
        meta: ['Breakfast tray', 'Delayed 5m'],
        status: { label: 'Delayed', tone: 'overdue' },
        actions: [{ label: 'Update guest', intent: { message: 'Sending delay update…' } }],
      },
      {
        title: 'ORD-106 • Poolside',
        meta: ['Fruit platter', 'Prep 7m'],
        status: { label: 'Preparing', tone: 'checkin' },
        actions: [{ label: 'Expedite', intent: { message: 'Flagging order to expedite…' } }],
      },
      {
        title: 'ORD-107 • Rm 221',
        meta: ['Evening tea', 'Scheduled 17:30'],
        status: { label: 'Scheduled', tone: 'ready' },
        actions: [{ label: 'Adjust', intent: { message: 'Adjusting schedule…' } }, { label: 'Notify guest', intent: { message: 'Calling room 221…' } }],
      },
    ],
  },
  billing: {
    summary: [
      'Collected today · $5,420',
      'Outstanding · $7,830',
      'Disputed · 2 cases awaiting review',
    ],
    pending: [
      {
        title: 'BILL-872 • Maria Lopez',
        meta: ['Rm 402', 'Balance $320'],
        status: { label: 'Due today', tone: 'checkout' },
        actions: [{ label: 'Collect', intent: { message: 'Collecting payment…' } }],
      },
      {
        title: 'BILL-875 • David Green',
        meta: ['Rm 219', 'Balance $180'],
        status: { label: 'Overdue', tone: 'overdue' },
        actions: [{ label: 'Remind', intent: { message: 'Sending payment reminder…' } }],
      },
      {
        title: 'BILL-876 • Corporate Event',
        meta: ['Banquet Hall', 'Balance $1,050'],
        status: { label: 'Awaiting PO', tone: 'ready' },
        actions: [{ label: 'Email', intent: { message: 'Emailing accounts payable…' } }],
      },
    ],
  },
  transactions: [
    '✅ Refund processed for booking #CH-883',
    '⚠ Pending card verification for booking #CH-895',
    '💼 Corporate billing batch exported at 07:15',
  ],
  reports: [
    '📈 Occupancy & ADR snapshot',
    '💳 Payment reconciliation',
    '🧾 Housekeeping productivity',
  ],
  contacts: [
    '👔 Duty Manager • +254 700 123123',
    '🔧 Maintenance Lead • +254 700 555444',
    '🍽️ F&B Supervisor • +254 701 808080',
  ],
};

const adminDashboardState = {
  welcome: {
    title: 'Welcome back, Michael!',
    subtitle: 'Guest satisfaction stands at 92%. You have 15 new bookings and 8 arrivals to steward today.',
  },
  metrics: [
    {
      title: 'TOTAL REVENUE',
      value: '$42,850',
      trend: { text: '18.2% from last month', tone: 'positive', icon: 'fas fa-arrow-up' },
      icon: { className: 'blue', html: '<i class="fas fa-dollar-sign"></i>' },
    },
    {
      title: 'OCCUPANCY RATE',
      value: '84%',
      trend: { text: '7.5% from last month', tone: 'positive', icon: 'fas fa-arrow-up' },
      icon: { className: 'green', html: '<i class="fas fa-bed"></i>' },
    },
    {
      title: 'NEW BOOKINGS',
      value: '28',
      trend: { text: '12.8% from last month', tone: 'positive', icon: 'fas fa-arrow-up' },
      icon: { className: 'orange', html: '<i class="fas fa-calendar-check"></i>' },
    },
    {
      title: 'GUEST SATISFACTION',
      value: '4.8/5',
      trend: { text: '0.4 from last month', tone: 'positive', icon: 'fas fa-arrow-up' },
      icon: { className: 'red', html: '<i class="fas fa-star"></i>' },
    },
  ],
  activity: [
    {
      icon: '<i class="fas fa-user-check"></i>',
      title: 'Check-in Completed',
      description: 'Robert Chen checked into Suite 301',
      time: '09:15 AM',
    },
    {
      icon: '<i class="fas fa-concierge-bell"></i>',
      title: 'Service Request',
      description: 'Room service requested for Room 204',
      time: '10:30 AM',
    },
    {
      icon: '<i class="fas fa-utensils"></i>',
      title: 'Restaurant Booking',
      description: 'Table reserved for 4 people at 7:00 PM',
      time: '11:45 AM',
    },
    {
      icon: '<i class="fas fa-bed"></i>',
      title: 'Room Cleaning',
      description: 'Room 105 marked as cleaned and ready',
      time: '01:20 PM',
    },
  ],
  bookings: [
    {
      guest: 'Robert Chen',
      meta: 'Suite 301 • 3 Nights • $1,200',
      status: { label: 'Arrived', tone: 'status-confirmed' },
    },
    {
      guest: 'Sophia Williams',
      meta: 'Deluxe Room • 5 Nights • $1,750',
      status: { label: 'Check-in 3:00 PM', tone: 'status-pending' },
    },
    {
      guest: 'James Wilson',
      meta: 'Executive Suite • 2 Nights • $900',
      status: { label: 'Arrived', tone: 'status-confirmed' },
    },
    {
      guest: 'Alexander Brown',
      meta: 'Standard Room • 7 Nights • $1,050',
      status: { label: 'Check-out 11:00 AM', tone: 'status-confirmed' },
    },
  ],
  staff: [
    {
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Sarah Johnson',
      role: 'Front Desk Manager',
      status: 'on',
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'David Wilson',
      role: 'Concierge',
      status: 'on',
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      name: 'Emily Chen',
      role: 'Housekeeping Supervisor',
      status: 'away',
    },
  ],
  feedback: [
    {
      guest: 'Robert Chen',
      rating: '<i class="fas fa-star"></i>'.repeat(5),
      content: '"Exceptional service! The staff went above and beyond to make our stay memorable."',
      date: 'Today, 10:30 AM',
    },
    {
      guest: 'Lisa Thompson',
      rating: '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>',
      content: '"Beautiful room with amazing views. The spa services were fantastic!"',
      date: 'Yesterday, 4:15 PM',
    },
  ],
  roomStatus: [
    { label: '101', tone: 'room-available', title: 'Available' },
    { label: '102', tone: 'room-occupied', title: 'Occupied' },
    { label: '103', tone: 'room-available', title: 'Available' },
    { label: '104', tone: 'room-maintenance', title: 'Maintenance' },
    { label: '105', tone: 'room-occupied', title: 'Occupied' },
    { label: '201', tone: 'room-available', title: 'Available' },
    { label: '202', tone: 'room-occupied', title: 'Occupied' },
    { label: '203', tone: 'room-available', title: 'Available' },
    { label: '204', tone: 'room-occupied', title: 'Occupied' },
    { label: '205', tone: 'room-available', title: 'Available' },
    { label: '301', tone: 'room-maintenance', title: 'Maintenance' },
    { label: '302', tone: 'room-available', title: 'Available' },
    { label: '303', tone: 'room-occupied', title: 'Occupied' },
    { label: '304', tone: 'room-available', title: 'Available' },
    { label: '305', tone: 'room-occupied', title: 'Occupied' },
  ],
  ledger: [
    {
      reservation: '#CH-4821',
      guest: 'Robert Chen',
      accommodation: 'Grand Suite · Harbor View',
      stay: '05 Nov – 08 Nov',
      status: { label: 'Checked-in', tone: 'pill-confirmed', icon: 'fas fa-circle' },
    },
    {
      reservation: '#CH-4827',
      guest: 'Sophia Williams',
      accommodation: 'Deluxe Room · King',
      stay: '05 Nov – 10 Nov',
      status: { label: 'Arriving 15:00', tone: 'pill-pending', icon: 'fas fa-circle' },
    },
    {
      reservation: '#CH-4834',
      guest: 'James Wilson',
      accommodation: 'Executive Suite · Oceanfront',
      stay: '04 Nov – 06 Nov',
      status: { label: 'In residence', tone: 'pill-confirmed', icon: 'fas fa-circle' },
    },
    {
      reservation: '#CH-4842',
      guest: 'Amelia Reyes',
      accommodation: 'Premier Villa · Private Pool',
      stay: '07 Nov – 14 Nov',
      status: { label: 'Pre-arrival', tone: 'pill-confirmed', icon: 'fas fa-circle' },
    },
    {
      reservation: '#CH-4816',
      guest: 'Alexander Brown',
      accommodation: 'Signature Suite · City Skyline',
      stay: '01 Nov – 08 Nov',
      status: { label: 'Check-out 11:00', tone: 'pill-confirmed', icon: 'fas fa-circle' },
    },
  ],
  roomInventory: [
    {
      room: 'Suite 301',
      category: 'Grand Suite · 110 m²',
      occupancy: '2 Adults',
      guestStatus: { label: 'Settled', tone: 'pill-confirmed', icon: 'fas fa-circle' },
      housekeeping: 'Evening refresh scheduled',
    },
    {
      room: 'Villa 12',
      category: 'Premier Villa · Private Pool',
      occupancy: '4 Guests',
      guestStatus: { label: 'Due 14:00', tone: 'pill-pending', icon: 'fas fa-circle' },
      housekeeping: 'Inspection in progress',
    },
    {
      room: 'Room 204',
      category: 'Deluxe Room · Partial Sea View',
      occupancy: '1 Adult',
      guestStatus: { label: 'In residence', tone: 'pill-confirmed', icon: 'fas fa-circle' },
      housekeeping: 'Amenity delivery 18:00',
    },
    {
      room: 'Suite 507',
      category: 'Executive Suite · Corner',
      occupancy: '2 Adults · 1 Child',
      guestStatus: { label: 'Late departure', tone: 'pill-confirmed', icon: 'fas fa-circle' },
      housekeeping: 'Turn-down complete',
    },
    {
      room: 'Room 118',
      category: 'Premier Room · Garden',
      occupancy: 'Vacant',
      guestStatus: { label: 'Out of order', tone: 'pill-cancelled', icon: 'fas fa-circle' },
      housekeeping: 'Maintenance · HVAC review',
    },
    {
      room: 'Penthouse 2',
      category: 'Royal Penthouse',
      occupancy: 'Reserved',
      guestStatus: { label: 'VIP hold', tone: 'pill-confirmed', icon: 'fas fa-circle' },
      housekeeping: 'Security clearance complete',
    },
  ],
  guests: [
    {
      guest: 'Michael Rodriguez',
      tier: '<span class="status-pill pill-vip"><i class="fas fa-gem"></i>Ambassador</span>',
      stay: '12 Nights',
      balance: '$0.00',
      notes: 'Prefers Colombian roast · Sunrise wake-up call',
    },
    {
      guest: 'Sarah Johnson',
      tier: '<span class="status-pill pill-longstay"><i class="fas fa-suitcase-rolling"></i>Long Stay</span>',
      stay: '21 Nights',
      balance: '$312.00',
      notes: 'Corporate contract · Pilates every Tuesday',
    },
    {
      guest: 'Emmanuel Laurent',
      tier: '<span class="status-pill pill-vip"><i class="fas fa-gem"></i>Diamond</span>',
      stay: '5 Nights',
      balance: '$1,120.50',
      notes: 'Champagne on arrival · Chef’s table confirmed',
    },
    {
      guest: 'Dr. Laila Ahmed',
      tier: '<span class="status-pill pill-confirmed"><i class="fas fa-circle"></i>Elite</span>',
      stay: '7 Nights',
      balance: '$0.00',
      notes: 'Allergy-friendly amenities · Limousine transfer',
    },
    {
      guest: 'Jonas Bergström',
      tier: '<span class="status-pill pill-longstay"><i class="fas fa-suitcase-rolling"></i>Extended</span>',
      stay: '18 Nights',
      balance: '$640.75',
      notes: 'Remote work suite · Scandinavian breakfast',
    },
  ],
  services: [
    {
      title: 'Spa Luce · Golden Hour Ritual',
      description: 'Six reservations confirmed · Couples suite prepared with lavender essence and bespoke refreshments.',
    },
    {
      title: "Chef's Table · Horizon Brasserie",
      description: 'Seasonal tasting menu finalized · Executive Chef Laurent greeting VIP party at 19:30.',
    },
    {
      title: 'Marina Concierge',
      description: 'Sunset yacht charter arranged for Suite 507 · Champagne and canapé service dockside.',
    },
    {
      title: 'Meetings & Events',
      description: 'Azure Ballroom set for 120-delegate summit · AV rehearsal scheduled for 14:00.',
    },
  ],
  reports: [
    {
      title: 'Occupancy & ADR',
      description: 'Week-to-date occupancy at 86% with ADR of $482. Forecast indicates 4% uplift over prior month.',
    },
    {
      title: 'Guest Sentiment',
      description: 'Voice-of-guest score at 4.82/5 · Concierge response times noted for excellence.',
    },
    {
      title: 'F&B Revenue',
      description: 'Restaurants pacing 12% above target · Afternoon tea service popular with executive floors.',
    },
    {
      title: 'Maintenance Outlook',
      description: 'Seven active work orders · Rooftop pool filtration upgrade scheduled overnight.',
    },
  ],
  settings: [
    { icon: 'fas fa-user-shield', label: 'Access Management · Update role credentials and multi-factor policies' },
    { icon: 'fas fa-credit-card', label: 'Billing Ledger · Configure folio routing and settlement rules' },
    { icon: 'fas fa-bell', label: 'Alert Centre · Tailor escalation paths for guest and operational notices' },
    { icon: 'fas fa-door-closed', label: 'Room Controls · Synchronize smart lock schedules and energy presets' },
    { icon: 'fas fa-globe', label: 'Global Preferences · Manage currency, language, and communication styles' },
    { icon: 'fas fa-database', label: 'Data Archive · Schedule compliance exports and retention windows' },
  ],
  revenueSeries: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [32000, 38000, 42000, 48000, 52000, 61000, 68000, 72000, 65000, 71000, 78000, 85000],
  },
};

function setActiveUserType(userType) {
  if (!userType) return;
  const tab = document.querySelector(`.tab-btn[data-value="${userType}"]`);
  if (tab) {
    tab.click();
  }
}

function renderAdminWelcome(welcome) {
  if (!welcome) return;
  setElementText('admin-welcome-title', welcome.title || '');
  setElementText('admin-welcome-subtitle', welcome.subtitle || '');
}

function renderAdminMetrics(metrics) {
  const container = document.getElementById('admin-metric-cards');
  const template = document.getElementById('admin-metric-template');
  if (!container) return;
  container.innerHTML = '';
  if (!template || !Array.isArray(metrics) || !metrics.length) return;

  metrics.forEach(metric => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="title"]', metric.title);
    setDomField(clone, '[data-field="value"]', metric.value);

    const iconEl = clone.querySelector('[data-field="icon"]');
    if (iconEl) {
      iconEl.className = `card-icon ${metric.icon?.className || ''}`.trim();
      iconEl.innerHTML = metric.icon?.html || '';
    }

    const trendEl = clone.querySelector('[data-field="trend"]');
    if (trendEl) {
      trendEl.className = ['card-footer', metric.trend?.tone || ''].filter(Boolean).join(' ');
      trendEl.innerHTML = metric.trend?.icon ? `<i class="${metric.trend.icon}"></i> ${metric.trend.text || ''}` : (metric.trend?.text || '');
    }

    container.appendChild(clone);
  });
}

function renderAdminActivity(activity) {
  const container = document.getElementById('admin-activity-list');
  const template = document.getElementById('admin-activity-template');
  if (!container) return;
  container.innerHTML = '';

  if (!template || !Array.isArray(activity) || !activity.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'empty-state';
    placeholder.textContent = 'No activity recorded for today.';
    container.appendChild(placeholder);
    return;
  }

  activity.forEach(item => {
    const clone = template.content.firstElementChild.cloneNode(true);
    const iconEl = clone.querySelector('[data-field="icon"]');
    if (iconEl) iconEl.innerHTML = item.icon || '';
    setDomField(clone, '[data-field="title"]', item.title);
    setDomField(clone, '[data-field="description"]', item.description);
    setDomField(clone, '[data-field="time"]', item.time);
    container.appendChild(clone);
  });
}

function renderAdminBookings(bookings) {
  renderTemplateList('admin-bookings-list', 'admin-booking-template', bookings, (clone, booking) => {
    setDomField(clone, '[data-field="guest"]', booking.guest);
    setDomField(clone, '[data-field="meta"]', booking.meta);
    const statusEl = clone.querySelector('[data-field="status"]');
    if (statusEl) {
      statusEl.className = ['booking-status', booking.status?.tone || ''].filter(Boolean).join(' ');
      statusEl.textContent = booking.status?.label || '';
    }
  }, 'No bookings yet.');
}

function renderAdminStaff(staff) {
  renderTemplateList('admin-staff-list', 'admin-staff-template', staff, (clone, member) => {
    const avatar = clone.querySelector('[data-field="avatar"]');
    if (avatar) {
      avatar.setAttribute('src', member.avatar || '');
      avatar.setAttribute('alt', member.name || 'Staff');
    }
    setDomField(clone, '[data-field="name"]', member.name);
    setDomField(clone, '[data-field="role"]', member.role);
    const statusEl = clone.querySelector('[data-field="status"]');
    if (statusEl) {
      statusEl.className = ['staff-status', member.status === 'away' ? 'away' : ''].filter(Boolean).join(' ');
    }
  }, 'No staff members are currently on duty.');
}

function renderAdminFeedback(feedback) {
  renderTemplateList('admin-feedback-list', 'admin-feedback-template', feedback, (clone, entry) => {
    setDomField(clone, '[data-field="guest"]', entry.guest);
    const ratingEl = clone.querySelector('[data-field="rating"]');
    if (ratingEl) ratingEl.innerHTML = entry.rating || '';
    setDomField(clone, '[data-field="content"]', entry.content);
    setDomField(clone, '[data-field="date"]', entry.date);
  }, 'No feedback has been recorded.');
}

function renderAdminRoomStatus(rooms) {
  const container = document.getElementById('admin-room-status');
  const template = document.getElementById('admin-room-template');
  if (!container) return;
  container.innerHTML = '';

  if (!template || !Array.isArray(rooms) || !rooms.length) return;

  rooms.forEach(room => {
    const clone = template.content.firstElementChild.cloneNode(true);
    clone.textContent = room.label || '';
    clone.className = ['room', room.tone || ''].filter(Boolean).join(' ');
    if (room.title) clone.setAttribute('title', `${room.label} · ${room.title}`);
    container.appendChild(clone);
  });
}

function renderAdminLedger(entries) {
  renderTemplateList('admin-ledger-body', 'admin-ledger-row-template', entries, (clone, entry) => {
    setDomField(clone, '[data-field="reservation"]', entry.reservation);
    setDomField(clone, '[data-field="guest"]', entry.guest);
    setDomField(clone, '[data-field="accommodation"]', entry.accommodation);
    setDomField(clone, '[data-field="stay"]', entry.stay);
    const statusEl = clone.querySelector('[data-field="status"]');
    if (statusEl) {
      statusEl.innerHTML = entry.status ? `<span class="status-pill ${entry.status.tone || ''}"><i class="${entry.status.icon || ''}"></i>${entry.status.label || ''}</span>` : '';
    }
  }, null, 5);
}

function renderAdminRoomInventory(rows) {
  renderTemplateList('admin-room-inventory', 'admin-room-row-template', rows, (clone, row) => {
    setDomField(clone, '[data-field="room"]', row.room);
    setDomField(clone, '[data-field="category"]', row.category);
    setDomField(clone, '[data-field="occupancy"]', row.occupancy);
    const guestStatus = clone.querySelector('[data-field="guestStatus"]');
    if (guestStatus) {
      guestStatus.innerHTML = row.guestStatus ? `<span class="status-pill ${row.guestStatus.tone || ''}"><i class="${row.guestStatus.icon || ''}"></i>${row.guestStatus.label || ''}</span>` : '';
    }
    setDomField(clone, '[data-field="housekeeping"]', row.housekeeping);
  });
}

function renderAdminGuestDirectory(guests) {
  renderTemplateList('admin-guest-directory', 'admin-guest-row-template', guests, (clone, guest) => {
    setDomField(clone, '[data-field="guest"]', guest.guest);
    const tierEl = clone.querySelector('[data-field="tier"]');
    if (tierEl) tierEl.innerHTML = guest.tier || '';
    setDomField(clone, '[data-field="stay"]', guest.stay);
    setDomField(clone, '[data-field="balance"]', guest.balance);
    setDomField(clone, '[data-field="notes"]', guest.notes);
  }, 'No guest profiles to display.');
}

function renderAdminServices(services) {
  renderTemplateCards('admin-services-grid', 'admin-service-template', services);
}

function renderAdminReports(reports) {
  renderTemplateCards('admin-reports-grid', 'admin-report-template', reports);
}

function renderAdminSettings(settings) {
  renderTemplateList('admin-settings-list', 'admin-setting-template', settings, (clone, item) => {
    const iconEl = clone.querySelector('[data-field="icon"]');
    if (iconEl) iconEl.className = item.icon || '';
    setDomField(clone, '[data-field="label"]', item.label);
  }, 'No administrative tools configured.');
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
        cell.colSpan = emptyColspan || (container.closest('table')?.querySelectorAll('th').length || 1);
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

  items.forEach(item => {
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

  items.forEach(item => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="title"]', item.title);
    setDomField(clone, '[data-field="description"]', item.description);
    container.appendChild(clone);
  });
}

let adminRevenueChart = null;

function renderAdminRevenueChart(series) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('admin-revenue-chart');
  if (!canvas) return;

  if (adminRevenueChart) {
    adminRevenueChart.destroy();
  }

  adminRevenueChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: series?.labels || [],
      datasets: [
        {
          label: 'Revenue ($)',
          data: series?.data || [],
          borderColor: '#8B7355',
          backgroundColor: 'rgba(139, 115, 85, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#8B7355',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          titleFont: { family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
          bodyFont: { family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
          callbacks: {
            label: context => `$${Number(context.parsed.y || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            callback: value => `$${Number(value || 0).toLocaleString()}`,
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}

function updateAdminDate() {
  const dateEl = document.getElementById('currentDate');
  if (!dateEl) return;
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function wireAdminSidebar() {
  const menuItems = document.querySelectorAll('.sidebar-menu li');
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.mobile-menu-btn');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const links = document.querySelectorAll('.sidebar-menu li a');
      links.forEach(a => a.removeAttribute('aria-current'));
      const activeLink = item.querySelector('a');
      if (activeLink) activeLink.setAttribute('aria-current', 'page');
      if (window.innerWidth <= 992 && sidebar) {
        sidebar.classList.remove('active');
      }
    });
  });

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const nowActive = !sidebar.classList.contains('active');
      sidebar.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', nowActive.toString());
    });
  }
}

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
    window.history.replaceState({}, document.title, `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`);
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

const staffProfiles = {
  'alex': {
    role: 'frontdesk',
    roleLabel: 'Front Desk',
    name: 'Alex Johnson',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    ext: '214',
  },
  'maria': {
    role: 'housekeeping',
    roleLabel: 'Housekeeping',
    name: 'Maria Lopez',
    shiftStart: '08:00',
    shiftEnd: '16:00',
    ext: '305',
  },
  'nina': {
    role: 'kitchen',
    roleLabel: 'Kitchen',
    name: 'Chef Nina',
    shiftStart: '06:00',
    shiftEnd: '14:00',
    ext: '118',
  },
  'samuel': {
    role: 'maintenance',
    roleLabel: 'Maintenance',
    name: 'Samuel Okoro',
    shiftStart: '09:00',
    shiftEnd: '17:00',
    ext: '450',
  },
};

function capitaliseName(input) {
  if (!input) return 'Team Member';
  return input
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function wireActionForms() {
  const actionForms = document.querySelectorAll('[data-action-form]');
  if (!actionForms.length) return;

  actionForms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const actionType = form.dataset.actionForm;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      console.log(`[Action Hub] ${actionType} submitted`, payload);
      form.classList.add('submitted');
      form.querySelectorAll('input, textarea').forEach(input => {
        if (input.type !== 'datetime-local') {
          input.value = '';
        }
      });
      const statusBanner = ensureActionBanner(form, `Request submitted for ${formatActionLabel(actionType)}.`);
      statusBanner.classList.add('success');
    });

    form.querySelectorAll('button[data-action]').forEach(button => {
      button.addEventListener('click', event => {
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
  return action
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatRoleLabel(roleKey) {
  if (!roleKey) return defaultStaffProfile.roleLabel;
  return roleKey
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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
  ['staff_role', 'staff_role_label', 'staff_name', 'staff_shift_start', 'staff_shift_end', 'staff_ext'].forEach(name => {
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

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.switch-tabs .tab-btn').forEach(b => b.classList.remove('active'));
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
    document.querySelectorAll('.switch-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const userType = btn.getAttribute('data-value');
    if (userTypeInput) userTypeInput.value = userType;
    clearErrors();
    if (loginContainer && typeof setLoginBackgroundFor === 'function') {
      setLoginBackgroundFor(userType);
    }

    if (userType === 'staff') {
      if (usernameInput) { usernameInput.style.display = 'block'; usernameInput.required = true; }
      if (emailInput) { emailInput.style.display = 'none'; emailInput.required = false; }
      if (loginBtn) loginBtn.textContent = 'Login as Staff';
      if (portalTitle) portalTitle.textContent = 'Staff Portal';
      if (portalDesc) portalDesc.textContent = 'Access your work dashboard';
      if (registerLink) registerLink.style.display = 'none';
    } else if (userType === 'admin') {
      if (usernameInput) { usernameInput.style.display = 'block'; usernameInput.required = true; }
      if (emailInput) { emailInput.style.display = 'none'; emailInput.required = false; }
      if (loginBtn) loginBtn.textContent = 'Login as Admin';
      if (portalTitle) portalTitle.textContent = 'Admin Portal';
      if (portalDesc) portalDesc.textContent = 'Manage hotel operations';
      if (registerLink) registerLink.style.display = 'none';
    } else {
      // Default to customer
      if (usernameInput) { usernameInput.style.display = 'none'; usernameInput.required = false; }
      if (emailInput) { emailInput.style.display = 'block'; emailInput.required = true; }
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
  const useStatic = typeof opts.preferStatic === 'boolean' ? opts.preferStatic : preferStaticDashboards;
  window.location.href = useStatic ? target.static : target.dynamic;
}

// Form submit with validation and demo mode
if (form && loginBtn) {
  form.addEventListener('submit', (e) => {
    clearErrors();
    const valid = validateForm();
    if (!valid) {
      e.preventDefault();
      return;
    }
    const userType = userTypeInput.value || 'customer';
    const profile = prepareStaffSession(userType);
    const identifierValue = (userType === 'customer'
      ? (emailInput ? emailInput.value.trim() : '')
      : (usernameInput ? usernameInput.value.trim() : '')).toLowerCase();
    const rawEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const pwd = passwordField ? passwordField.value.trim() : '';

    const isTempLogin = (identifierValue === TEMP_EMAIL.toLowerCase() || rawEmail === TEMP_EMAIL.toLowerCase())
      && pwd === TEMP_PASSWORD;

    if (isTempLogin) {
      e.preventDefault();
      if (userType === 'staff' && profile) {
        applyStaffDataset(profile);
      }
      redirectToDashboard(userType, { preferStatic: true });
      return;
    }
    if (demoMode) {
      e.preventDefault();
      if (userType === 'staff' && profile) {
        applyStaffDataset(profile);
      }
      redirectToDashboard(userType, { preferStatic: true });
      return;
    } else if (profile && form) {
      applyStaffDataset(profile);
    }
  });
  loginBtn.addEventListener('click', (e) => {
    clearErrors();
    const valid = validateForm();
    if (!valid) {
      e.preventDefault();
      return;
    }
    const userType = userTypeInput.value || 'customer';
    const profile = prepareStaffSession(userType);
    const identifierValue = (userType === 'customer'
      ? (emailInput ? emailInput.value.trim() : '')
      : (usernameInput ? usernameInput.value.trim() : '')).toLowerCase();
    const rawEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const pwd = passwordField ? passwordField.value.trim() : '';
    const isTempLogin = (identifierValue === TEMP_EMAIL.toLowerCase() || rawEmail === TEMP_EMAIL.toLowerCase())
      && pwd === TEMP_PASSWORD;
    if (isTempLogin || demoMode) {
      e.preventDefault();
      if (userType === 'staff' && profile) {
        applyStaffDataset(profile);
      }
      redirectToDashboard(userType, { preferStatic: true });
    }
  });
}

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
  const userType = userTypeInput ? (userTypeInput.value || 'customer') : 'customer';
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

const customerDashboardState = {
  profile: {
    name: 'Joseph Kilonzo',
    salutation: 'Welcome back',
    subtext: 'Your suite has been refreshed, the concierge is standing by, and bespoke experiences are ready whenever you are. Enjoy exclusive lounge access, personal itinerary updates, and handpicked city adventures tailored to your taste.',
    loyaltyBadges: [
      { label: '🌟 Elite Loyalty Guest', tone: 'accent' },
      { label: '🛎️ Personal Concierge On Call', tone: 'neutral' },
      { label: '🕒 Late Checkout Confirmed', tone: 'neutral' },
    ],
  },
  navSections: {
    bookings: 'bookings',
    reservations: 'reservations',
    payments: 'payments',
    receipts: 'receipts',
    orders: 'orders',
  },
  bookings: {
    stats: {
      activeStay: {
        value: 'Room 101',
        meta: 'Checking out Nov 18',
      },
      upcomingStays: {
        value: 2,
        meta: 'Next arrival Nov 24',
      },
      upgradeRequests: {
        value: 1,
        meta: 'Awaiting confirmation',
      },
    },
    current: {
      title: 'Currently in-house · Deluxe Suite',
      status: { label: 'Confirmed', tone: 'success' },
      meta: [
        { label: 'Stay', value: 'Nov 12 – Nov 18 · 6 nights' },
        { label: 'Guests', value: 'John & Emma Doe · 2 adults · 1 child' },
        { label: 'Inclusions', value: 'Breakfast · Executive lounge · Late checkout' },
      ],
      addons: [
        { label: 'Butler service', tone: 'accent' },
        { label: 'Airport transfer', tone: 'neutral' },
        { label: 'Signature pillow menu', tone: 'neutral' },
      ],
      actions: [
        {
          label: 'View stay brief',
          variant: ['btn', 'primary'],
          intent: { fn: 'showBookingDetails', args: ['BK001'] },
        },
        {
          label: 'Request upgrade',
          variant: ['btn', 'ghost'],
          intent: { fn: 'startBooking', args: ['Deluxe Suite upgrade request'] },
        },
      ],
    },
    planner: {
      title: 'Trip planner',
      badge: { label: 'Personalized', tone: 'neutral' },
      description: 'Tailor housekeeping times, add celebration touches, or schedule spa rituals before you arrive.',
      meta: [
        { label: 'Next arrival', value: 'Nov 24 · Family Villa' },
        { label: 'Airport pickup', value: 'Reserved · Chauffeur James A.' },
        { label: 'Special notes', value: 'Anniversary dinner · Vegan welcome amenities' },
      ],
      actions: [
        {
          label: 'Curate itinerary',
          variant: ['btn', 'booking-cta'],
          intent: { fn: 'gotoSection', args: ['reservations'] },
        },
      ],
    },
    list: [
      {
        id: 'BK001',
        suite: 'Deluxe Suite · Horizon Wing',
        dates: 'Nov 12 – Nov 18',
        status: { label: 'Confirmed', tone: 'confirmed' },
        addons: [
          { label: 'Butler', tone: 'accent' },
          { label: 'Spa access', tone: 'neutral' },
        ],
        actions: [
          { label: 'View', intent: { fn: 'showBookingDetails', args: ['BK001'] } },
          { label: 'Modify', intent: { fn: 'startBooking', args: ['Deluxe Suite'] } },
        ],
      },
      {
        id: 'BK002',
        suite: 'Standard Room · City Deluxe',
        dates: 'Dec 01 – Dec 03',
        status: { label: 'Pending', tone: 'pending' },
        addons: [
          { label: 'Airport shuttle', tone: 'warning' },
        ],
        actions: [
          { label: 'Review', intent: { fn: 'showBookingDetails', args: ['BK002'] } },
          { label: 'Confirm', intent: { fn: 'startBooking', args: ['Standard Room'] } },
        ],
      },
      {
        id: 'BK003',
        suite: 'Executive Suite · Tranquility Tower',
        dates: 'Dec 10 – Dec 15',
        status: { label: 'Confirmed', tone: 'confirmed' },
        addons: [
          { label: 'Club lounge', tone: 'neutral' },
          { label: 'City tour', tone: 'neutral' },
        ],
        actions: [
          { label: 'View', intent: { fn: 'showBookingDetails', args: ['BK003'] } },
          { label: 'Add-ons', intent: { fn: 'startBooking', args: ['Executive Suite'] } },
        ],
      },
    ],
  },
  payments: {
    outstanding: {
      amount: '$450.00',
      meta: 'Includes spa services',
    },
    lastPayment: {
      amount: '$320.00',
      meta: 'Processed Oct 28',
    },
    summary: {
      caption: 'Current stay charges',
      amount: '$1,820.00',
      meta: 'Includes accommodation, in-room dining, and spa treatments.',
      breakdown: [
        { label: 'Room', amount: '$1,200', tone: 'neutral' },
        { label: 'Dining', amount: '$420', tone: 'accent' },
        { label: 'Spa', amount: '$200', tone: 'warning' },
      ],
      actions: [
        { label: 'Download invoices', variant: ['btn', 'primary'], intent: { fn: 'gotoSection', args: ['receipts'] } },
        { label: 'View current bill', variant: ['btn', 'ghost'], intent: { fn: 'showPaymentReceipt', args: ['BILL001'] } },
      ],
    },
    methods: {
      entries: [
        { label: 'Primary card', value: 'Amex ending ·· 4821 · Auto-pay enabled' },
        { label: 'Billing email', value: 'billing@josephkilonzo.com' },
        { label: 'Backup option', value: 'Visa ending ·· 9910 · Requires verification' },
      ],
      actions: [
        { label: 'Settle balance', variant: ['btn', 'primary'], intent: { message: 'Opening secure payment portal…' } },
        { label: 'Request statement', variant: ['btn', 'ghost'], intent: { fn: 'gotoSection', args: ['support'] } },
      ],
    },
    recent: [
      {
        reference: 'BILL001',
        description: 'Room Booking · Deluxe Suite',
        date: 'Nov 18',
        amount: '$750.00',
        status: { label: 'Pending', tone: 'pending' },
        actions: [
          { label: 'Details', intent: { fn: 'showPaymentReceipt', args: ['BILL001'] } },
          { label: 'Pay now', intent: { message: 'Processing payment…' } },
        ],
      },
      {
        reference: 'BILL006',
        description: 'Extended Stay Adjustment',
        date: 'Oct 28',
        amount: '$320.00',
        status: { label: 'Paid', tone: 'confirmed' },
        actions: [
          { label: 'Receipt', intent: { fn: 'showPaymentReceipt', args: ['BILL006'] } },
        ],
      },
      {
        reference: 'BILL005',
        description: 'Mini Bar Selection',
        date: 'Oct 26',
        amount: '$95.00',
        status: { label: 'Paid', tone: 'confirmed' },
        actions: [
          { label: 'Receipt', intent: { fn: 'showPaymentReceipt', args: ['BILL005'] } },
        ],
      },
    ],
  },
  receipts: {
    list: [
      {
        title: 'BILL001 · Deluxe Suite',
        badge: { label: 'Pending', tone: 'warning' },
        description: 'Comprehensive summary of the current stay including dining and spa charges.',
        meta: [
          { label: 'Amount', value: '$750.00' },
          { label: 'Issued', value: 'Nov 18, 2025' },
          { label: 'Method', value: 'Pending payment' },
        ],
        actions: [
          { label: 'Download PDF', variant: ['btn', 'booking-cta'], intent: { fn: 'downloadReceipt', args: ['BILL001'] } },
          { label: 'View summary', variant: ['btn', 'ghost'], intent: { fn: 'showPaymentReceipt', args: ['BILL001'] } },
        ],
      },
      {
        title: 'BILL006 · Stay Extension',
        badge: { label: 'Paid', tone: 'success' },
        description: 'Additional nights extension and late checkout privilege.',
        meta: [
          { label: 'Amount', value: '$320.00' },
          { label: 'Issued', value: 'Oct 28, 2025' },
          { label: 'Method', value: 'Visa · Approved' },
        ],
        actions: [
          { label: 'Download PDF', variant: ['btn', 'booking-cta'], intent: { fn: 'downloadReceipt', args: ['BILL006'] } },
          { label: 'View summary', variant: ['btn', 'ghost'], intent: { fn: 'showPaymentReceipt', args: ['BILL006'] } },
        ],
      },
      {
        title: 'BILL005 · Mini Bar',
        badge: { label: 'Paid', tone: 'success' },
        description: 'Curated in-suite refreshments and specialty beverages.',
        meta: [
          { label: 'Amount', value: '$95.00' },
          { label: 'Issued', value: 'Oct 20, 2025' },
          { label: 'Method', value: 'Room charge · Settled' },
        ],
        actions: [
          { label: 'Download PDF', variant: ['btn', 'booking-cta'], intent: { fn: 'downloadReceipt', args: ['BILL005'] } },
          { label: 'View summary', variant: ['btn', 'ghost'], intent: { fn: 'showPaymentReceipt', args: ['BILL005'] } },
        ],
      },
    ],
    actions: [
      { label: 'Export all receipts', variant: ['btn', 'primary'], intent: { message: 'Exporting CSV & PDF bundle…' } },
      { label: 'Back to payments', variant: ['btn', 'ghost'], intent: { fn: 'gotoSection', args: ['payments'] } },
    ],
  },
  reservations: {
    stats: {
      week: { value: 4, meta: 'Confirmed experiences' },
      holds: { value: 2, meta: 'Pending approval' },
    },
    highlight: {
      title: 'Highlighted itinerary',
      badge: { label: 'Locked in', tone: 'success' },
      events: [
        {
          time: 'Nov 15 · 19:00',
          title: "Chef's Table · Lumière Restaurant",
          description: 'Six-course tasting menu with wine pairing · Table for two.',
        },
        {
          time: 'Nov 16 · 09:30',
          title: 'Serenity Spa · Couples Ritual',
          description: '90-minute hot stone therapy · Aromatherapy upgrade requested.',
        },
        {
          time: 'Nov 17 · 14:00',
          title: 'Skyline Lounge · Afternoon Tea',
          description: 'Reserved window seating · Live jazz quartet from 2:30 PM.',
        },
      ],
    },
    recommendations: {
      title: 'Concierge recommendations',
      badge: { label: 'Action needed', tone: 'warning' },
      copy: 'Confirm additional perks to secure limited availability experiences.',
      items: [
        { label: 'Sunset cruise', value: 'Awaiting confirmation · 2 seats held until Nov 14' },
        { label: 'Private gallery tour', value: 'Complimentary · RSVP required by Nov 15' },
        { label: 'Airport lounge', value: 'Complimentary · Access on departure day' },
      ],
      actions: [
        { label: 'Confirm holds', variant: ['btn', 'primary'], intent: { fn: 'startBooking', args: ['Concierge follow-up'] } },
        { label: 'Message concierge', variant: ['btn', 'ghost'], intent: { fn: 'gotoSection', args: ['support'] } },
      ],
    },
    list: [
      {
        experience: "Chef's Table Dinner",
        schedule: 'Nov 15 · 7:00 PM',
        guests: '2',
        status: { label: 'Confirmed', tone: 'confirmed' },
        notes: 'Wine pairing upgrade',
        actions: [
          { label: 'Modify', intent: { fn: 'viewAll', args: ['reservations'] } },
        ],
      },
      {
        experience: 'Couples Spa Ritual',
        schedule: 'Nov 16 · 9:30 AM',
        guests: '2',
        status: { label: 'Confirmed', tone: 'confirmed' },
        notes: 'Aromatherapy add-on',
        actions: [
          { label: 'Adjust', intent: { fn: 'viewAll', args: ['reservations'] } },
        ],
      },
      {
        experience: 'Sunset Cruise',
        schedule: 'Nov 18 · 5:45 PM',
        guests: '2',
        status: { label: 'Pending', tone: 'pending' },
        notes: 'Awaiting final confirmation',
        actions: [
          { label: 'Confirm', intent: { fn: 'viewAll', args: ['reservations'] } },
        ],
      },
    ],
  },
  orders: {
    stats: {
      active: { value: 2, meta: '1 in kitchen · 1 ready' },
      average: { value: '18m', meta: 'Last 7 days' },
    },
    timeline: {
      title: 'Live order timeline',
      badge: { label: 'Auto refresh', tone: 'neutral' },
      events: [
        {
          time: 'ORD014 · 18:25',
          title: 'Skyline Lounge · Chef tasting flight',
          description: 'Status: Queued · Prep begins in 5 minutes.',
        },
        {
          time: 'ORD012 · 18:10',
          title: 'Suite 101 · Truffle pasta & garden salad',
          description: 'Status: In Kitchen · ETA 12 minutes · Contactless delivery.',
        },
        {
          time: 'ORD010 · 17:40',
          title: 'Lobby Café pickup · Espresso & croissant',
          description: 'Status: Ready · Awaiting pickup notification.',
        },
      ],
      actions: [
        { label: 'Open live tracker', variant: ['btn', 'primary'], intent: { fn: 'gotoSection', args: ['dashboard'] } },
        { label: 'Reorder favorites', variant: ['btn', 'ghost'], intent: { fn: 'reorder', args: ['ORD010'] } },
      ],
    },
    history: [
      {
        order: 'ORD008',
        items: 'Grilled chicken · Seasonal vegetables',
        date: 'Nov 10',
        status: { label: 'Delivered', tone: 'completed' },
        total: '$40.00',
        actions: [
          { label: 'Reorder', intent: { fn: 'reorder', args: ['ORD008'] } },
          { label: 'Track', intent: { fn: 'trackOrder', args: ['ORD008'] } },
        ],
      },
      {
        order: 'ORD007',
        items: 'Garden salad · Soup · Sandwich',
        date: 'Nov 08',
        status: { label: 'Preparing', tone: 'pending' },
        total: '$28.00',
        actions: [
          { label: 'Status', intent: { fn: 'trackOrder', args: ['ORD007'] } },
        ],
      },
      {
        order: 'ORD005',
        items: 'Sushi platter · Green tea',
        date: 'Nov 05',
        status: { label: 'Delivered', tone: 'completed' },
        total: '$45.00',
        actions: [
          { label: 'Reorder', intent: { fn: 'reorder', args: ['ORD005'] } },
          { label: 'Track', intent: { fn: 'trackOrder', args: ['ORD005'] } },
        ],
      },
    ],
  },
  support: {
    stats: {
      reply: { value: '6m', meta: 'Live concierge chat' },
      open: { value: 1, meta: 'Follow-up scheduled' },
    },
    concierge: {
      title: 'Concierge desk',
      badge: { label: 'Always on', tone: 'success' },
      meta: [
        { label: 'Current liaison', value: 'Amelia Cruz · Suite concierge · Ext. 771' },
        { label: 'Typical response', value: 'Under 10 minutes via chat · 2 minutes via phone' },
        { label: 'Priority services', value: 'Late checkout · Experience curation · Special amenities' },
      ],
      actions: [
        { label: 'View concierge plan', variant: ['btn', 'primary'], intent: { fn: 'gotoSection', args: ['reservations'] } },
        { label: 'Track dining request', variant: ['btn', 'ghost'], intent: { fn: 'gotoSection', args: ['orders'] } },
      ],
    },
    timeline: {
      title: 'Open request timeline',
      badge: { label: 'Live updates', tone: 'neutral' },
      events: [
        {
          time: '08:20 · Today',
          title: 'Late checkout approved',
          description: 'Housekeeping notified · Room 101 scheduled for 2:00 PM refresh.',
        },
        {
          time: '11:05 · Today',
          title: 'Spa ritual adjustment',
          description: 'Therapist assigned · Aromatherapy upgrade confirmed for Nov 16.',
        },
        {
          time: 'Awaiting reply',
          title: 'Sunset cruise hold',
          description: 'Captain Valencia holding 2 premium seats until Nov 14, 5:00 PM.',
        },
      ],
    },
    channels: [
      {
        title: '🛎️ Concierge line',
        badge: { label: '24/7', tone: 'success' },
        highlight: '+254 700 555 100',
        meta: 'Direct lobby desk',
        description: 'Perfect for immediate room arrangements, transport, or bespoke celebrations.',
        actions: [
          { label: 'Request call back', variant: ['btn', 'ghost'], intent: { fn: 'startBooking', args: ['Concierge call back'] } },
          { label: 'Manage stay', variant: ['btn', 'primary'], intent: { fn: 'gotoSection', args: ['bookings'] } },
        ],
      },
      {
        title: '💳 Billing desk',
        badge: { label: 'Daily 06:00-23:00', tone: 'neutral' },
        highlight: 'billing@championhotel.com',
        meta: 'Escalations respond in 15m',
        description: 'Clarify invoices, pre-authorizations, or secure payment links instantly.',
        actions: [
          { label: 'View receipts', variant: ['btn', 'ghost'], intent: { fn: 'gotoSection', args: ['receipts'] } },
          { label: 'Settle balance', variant: ['btn', 'primary'], intent: { fn: 'gotoSection', args: ['payments'] } },
        ],
      },
      {
        title: '🍽️ Dining liaison',
        badge: { label: 'Peak 17:00-21:00', tone: 'warning' },
        highlight: 'ext. 884 · Lumière',
        meta: "Chef's table concierge",
        description: 'Coordinate in-suite dining, dietary requirements, and chef experiences.',
        actions: [
          { label: 'Track orders', variant: ['btn', 'ghost'], intent: { fn: 'gotoSection', args: ['orders'] } },
          { label: 'Book tasting', variant: ['btn', 'primary'], intent: { fn: 'startBooking', args: ['Private dining consultation'] } },
        ],
      },
    ],
  },
};

function initialiseCustomerDashboard() {
  renderCustomerWelcome(customerDashboardState.profile);
  renderCustomerNavCounts(customerDashboardState);
  renderBookingSummary(customerDashboardState.bookings);
  renderPaymentsSection(customerDashboardState.payments);
  renderReceiptsSection(customerDashboardState.receipts);
  renderReservationsSection(customerDashboardState.reservations);
  renderOrdersSection(customerDashboardState.orders);
  initialiseSupportChannels(customerDashboardState.supportChannels);
  initialiseInRoomDiningFeed();
  wireCustomerQuickActions();
}

function initialiseAdminDashboard() {
  if (!document.body.classList.contains('admin-dashboard')) return;
  renderAdminWelcome(adminDashboardState.welcome);
  renderAdminMetrics(adminDashboardState.metrics);
  renderAdminActivity(adminDashboardState.activity);
  renderAdminBookings(adminDashboardState.bookings);
  renderAdminStaff(adminDashboardState.staff);
  renderAdminFeedback(adminDashboardState.feedback);
  renderAdminRoomStatus(adminDashboardState.roomStatus);
  renderAdminLedger(adminDashboardState.ledger);
  renderAdminRoomInventory(adminDashboardState.roomInventory);
  renderAdminGuestDirectory(adminDashboardState.guests);
  renderAdminServices(adminDashboardState.services);
  renderAdminReports(adminDashboardState.reports);
  renderAdminSettings(adminDashboardState.settings);
  renderAdminRevenueChart(adminDashboardState.revenueSeries);
  wireAdminSidebar();
  updateAdminDate();
}

function renderCustomerWelcome(profile) {
  if (!profile) return;
  const welcomeHeading = document.getElementById('welcome');
  if (welcomeHeading) {
    const greeting = profile.salutation ? `${profile.salutation}, ${profile.name}` : profile.name;
    welcomeHeading.textContent = greeting;
  }

  setElementText('welcome-subtext', profile.subtext || '');

  const badgesContainer = document.getElementById('loyalty-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    const badges = Array.isArray(profile.loyaltyBadges) ? profile.loyaltyBadges : [];
    if (!badges.length) {
      const placeholder = document.createElement('span');
      placeholder.className = 'welcome-badge muted';
      placeholder.textContent = 'Update your profile to unlock perks';
      badgesContainer.appendChild(placeholder);
    } else {
      badges.forEach(badge => {
        const badgeEl = document.createElement('span');
        badgeEl.className = 'welcome-badge';
        badgeEl.textContent = badge.label;
        badgesContainer.appendChild(badgeEl);
      });
    }
  }
}

function renderCustomerNavCounts(state) {
  if (!state) return;
  const navCounts = {
    bookings: state.bookings?.list?.length || 0,
    reservations: Array.isArray(state.reservations?.list) ? state.reservations.list.length : 0,
    payments: state.payments?.recent?.length || 0,
    receipts: state.receipts?.list?.length || 0,
    orders: Array.isArray(state.orders?.history) ? state.orders.history.length : 0,
  };

  Object.entries(navCounts).forEach(([key, value]) => {
    const el = document.getElementById(`nav-count-${key}`);
    if (el) el.textContent = value;
  });
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

  items.forEach(item => {
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
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(items) || !items.length) {
    const placeholder = document.createElement('li');
    placeholder.className = 'meta-empty';
    placeholder.textContent = 'Details will appear here once provided.';
    container.appendChild(placeholder);
    return;
  }

  items.forEach(entry => {
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
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
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
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
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
    summary.breakdown.forEach(item => {
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

  items.forEach(entry => {
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
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
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

  items.forEach(item => {
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

  actions.forEach(action => {
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
  renderActionButtons('reservations-recommendations-actions', reservations.recommendations?.actions);
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
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!Array.isArray(events) || !events.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'timeline-item';
    const message = document.createElement('p');
    message.textContent = 'No updates at this time.';
    placeholder.appendChild(message);
    container.appendChild(placeholder);
    return;
  }

  events.forEach(event => {
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

  reservations.forEach(entry => {
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

  history.forEach(entry => {
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
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
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

  channels.forEach(channel => {
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

  items.forEach(entry => {
    const pill = document.createElement('span');
    pill.className = ['pill', entry?.tone || 'neutral'].filter(Boolean).join(' ');
    pill.textContent = entry?.label || '';
    container.appendChild(pill);
  });
}

function renderActionButtons(containerId, actions) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(actions) || !actions.length) {
    return;
  }

  actions.forEach(action => {
    const button = document.createElement('button');
    const classes = Array.isArray(action.variant) ? action.variant : ['btn', 'ghost'];
    button.className = classes.join(' ');
    button.type = action.type || 'button';
    button.textContent = action.label || 'Action';

    if (action.intent) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetFn = typeof action.intent.fn === 'function' ? action.intent.fn : window[action.intent.fn];
        if (typeof targetFn === 'function') {
          const args = Array.isArray(action.intent.args) ? action.intent.args : [];
          targetFn.apply(window, args);
        } else if (action.intent.message) {
          alert(action.intent.message);
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
      alert(intent.message);
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

// Confirmation Dialogs for Destructive Actions
function setupConfirmationDialogs() {
    document.querySelectorAll('.btn-danger, .cancel-btn, .delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
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
    document.querySelectorAll('.data-table').forEach(table => {
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
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
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

function renderStaffAssignments(items, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach(item => {
    const frag = cloneTemplate('staff-assignment-template');
    if (!frag) return;
    const card = frag.querySelector('.assignment-card');
    if (card) {
      const slug = typeof item.role === 'string' ? item.role.toLowerCase().replace(/\s+/g, '') : '';
      card.setAttribute('data-role', slug);
    }
    const roleEl = frag.querySelector('[data-field="role"]');
    if (roleEl) roleEl.textContent = item.role;
    const statusEl = frag.querySelector('[data-field="status"]');
    if (statusEl) statusEl.textContent = typeof item.status === 'string' ? item.status : (item.status && item.status.label ? item.status.label : '');
    const titleEl = frag.querySelector('[data-field="title"]');
    if (titleEl) titleEl.textContent = item.title;
    const descEl = frag.querySelector('[data-field="description"]');
    if (descEl) descEl.textContent = item.description;
    const metaList = frag.querySelector('[data-field="meta"]');
    if (metaList) {
      item.meta.forEach(text => {
        const m = cloneTemplate('staff-assignment-meta-template');
        if (!m) return;
        const li = m.querySelector('li');
        li.textContent = text;
        metaList.appendChild(m);
      });
    }
    const actionsEl = frag.querySelector('[data-field="actions"]');
    if (actionsEl) {
      item.actions.forEach(action => {
        const a = cloneTemplate('staff-assignment-action-template');
        if (!a) return;
        const btn = a.querySelector('button');
        const label = typeof action === 'string' ? action : (action && action.label ? action.label : 'Action');
        btn.textContent = label;
        actionsEl.appendChild(a);
      });
    }
    grid.appendChild(frag);
  });
}

function renderRoomManagement(state) {
  const statusGrid = document.getElementById('room-status-grid');
  if (statusGrid) {
    statusGrid.innerHTML = '';
    state.statusBlocks.forEach(block => {
      const f = cloneTemplate('room-status-block-template');
      if (!f) return;
      const h = f.querySelector('header');
      if (h) h.textContent = block.title;
      const ul = f.querySelector('[data-field="items"]');
      block.lines.forEach(line => {
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
    state.roster.forEach(row => {
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
    state.notes.forEach(text => {
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
  items.forEach(b => {
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

function renderStaffActionHub(cards) {
  const grid = document.getElementById('staff-action-grid');
  if (!grid) return;
  grid.innerHTML = '';
  (Array.isArray(cards) ? cards : []).forEach(c => {
    const cardFrag = cloneTemplate('staff-action-card-template');
    if (!cardFrag) return;
    const card = cardFrag.querySelector('.action-card');
    card.querySelector('[data-field="title"]').textContent = c.title;
    const badge = card.querySelector('[data-field="badge"]');
    if (badge) badge.textContent = (typeof c.badge === 'string') ? c.badge : (c.badge && c.badge.label ? c.badge.label : '');
    const formContainer = cardFrag.querySelector('[data-field="form"]');
    const form = document.createElement('form');
    (Array.isArray(c.fields) ? c.fields : []).forEach(f => {
      const labelFrag = cloneTemplate('staff-action-field-template');
      const label = labelFrag.querySelector('label');
      label.textContent = f.label;
      const inputFrag = cloneTemplate('staff-action-input-template');
      form.appendChild(labelFrag);
      form.appendChild(inputFrag);
    });
    const actions = document.createElement('div');
    const btnEntries = Array.isArray(c.buttons) ? c.buttons : (Array.isArray(c.actions) ? c.actions : []);
    btnEntries.forEach(b => {
      const btnFrag = cloneTemplate('staff-action-button-template');
      const btn = btnFrag.querySelector('button');
      const label = typeof b === 'string' ? b : (b && b.label ? b.label : 'Action');
      btn.textContent = label;
      if (b && b.intent) attachActionHandler(btn, b.intent);
      actions.appendChild(btnFrag);
    });
    form.appendChild(actions);
    formContainer.appendChild(form);
    grid.appendChild(cardFrag);
  });
}

function wireStaffNavigation() {
  const links = document.querySelectorAll('.sidebar nav a[data-section]');
  const sections = document.querySelectorAll('.content-section');
  const hamburger = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      const nowActive = !sidebar.classList.contains('active');
      sidebar.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', nowActive.toString());
      sidebar.setAttribute('aria-hidden', (!nowActive).toString());
    });
  }
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('data-section');
      sections.forEach(s => s.classList.remove('active'));
      const target = document.getElementById(id);
      if (target) target.classList.add('active');
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      links.forEach(l => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
      if (window.innerWidth <= 992 && sidebar && hamburger) {
        sidebar.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

function wireCustomerSidebar() {
  const hamburger = document.getElementById('customer-hamburger');
  const sidebar = document.getElementById('sidebar');
  if (!hamburger || !sidebar) return;
  hamburger.addEventListener('click', () => {
    const nowActive = !sidebar.classList.contains('active');
    sidebar.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', nowActive.toString());
    sidebar.setAttribute('aria-hidden', (!nowActive).toString());
  });
}

function initialiseStaffDashboard() {
  updateClock();
  setInterval(updateClock, 60000);
  renderStaffAssignments(staffDashboardState.assignments.frontdesk, 'staff-assignments-grid');
  renderRoomManagement(staffDashboardState.rooms);
  renderShiftBookings(staffDashboardState.shiftBookings);
  renderStaffActionHub(staffDashboardState.actionHub || staffDashboardState.actions || []);
  wireStaffNavigation();
}

function setupOfflineDetection() {
  const bannerId = 'offline-banner';
  let banner = document.getElementById(bannerId);
  function show() {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = bannerId;
      banner.textContent = 'You are offline';
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#b91c1c;color:#fff;font-size:12px;padding:6px;text-align:center;z-index:9999;';
      document.body.appendChild(banner);
    }
    banner.style.display = 'block';
  }
  function hide() { if (banner) banner.style.display = 'none'; }
  if (!navigator.onLine) show(); else hide();
  window.addEventListener('offline', show);
  window.addEventListener('online', hide);
}

function setupTouchOptimization() {
  document.querySelectorAll('button, a').forEach(el => {
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
    const focusable = drawer.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus(); else drawer.focus();
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
  function onKeyDown(e) { if (e.key === 'Escape') close(); }
  function onDocClick(e) {
    if (drawer.contains(e.target) || toggle.contains(e.target)) return;
    close();
  }
  toggle.addEventListener('click', function() {
    if (drawer.classList.contains('open')) close(); else open();
  });
  drawer.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(drawer.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
document.addEventListener('DOMContentLoaded', function() {
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

    // Add loading states to all form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) showLoading(submitBtn);
        });
    });
});
