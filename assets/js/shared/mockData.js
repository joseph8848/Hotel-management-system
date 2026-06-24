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
        meta: ['👤 Assigned to Alex Johnson', '📞 Airport transfer confirmed · ETA 10:40'],
        actions: [
          {
            label: 'Checklist',
            variant: ['pill-btn'],
            intent: { message: 'Opening guest checklist…' },
          },
          {
            label: 'Reassign',
            variant: ['pill-btn', 'ghost'],
            intent: { message: 'Prompting assignment dialog…' },
          },
        ],
      },
      {
        role: 'Front Desk',
        status: { label: 'Due 10:30', tone: 'priority-low' },
        title: 'Prepare late checkout folio',
        description:
          'Finalize folio for room 305 and arrange transport voucher for 11:15 departure.',
        meta: ['💳 Balance $220 · Card on file', '🕓 Guest confirmed lobby pickup 11:05'],
        actions: [
          {
            label: 'View folio',
            variant: ['pill-btn'],
            intent: { message: 'Opening folio viewer…' },
          },
          {
            label: 'Send reminder',
            variant: ['pill-btn', 'ghost'],
            intent: { message: 'Sending SMS reminder…' },
          },
        ],
      },
    ],
    housekeeping: [
      {
        role: 'Housekeeping',
        status: { label: 'Due 10:15', tone: 'priority-high' },
        title: 'Suite 804 refresh',
        description: 'Deep clean with turndown setup and floral amenity for honeymoon guests.',
        meta: ['🧹 Assigned to Tessa K.', '🌸 Amenities delivered to service closet'],
        actions: [
          {
            label: 'Start task',
            variant: ['pill-btn'],
            intent: { message: 'Marking task in progress…' },
          },
          {
            label: 'Mark done',
            variant: ['pill-btn', 'ghost'],
            intent: { message: 'Marking task complete…' },
          },
        ],
      },
    ],
    kitchen: [
      {
        role: 'Kitchen',
        status: { label: 'Due 11:20', tone: 'priority-high' },
        title: 'Conference brunch prep',
        description:
          '12 vegetarian plates · confirm allergy tags and stage warmers for Horizon room.',
        meta: ['👩‍🍳 Assigned to Prep Team A', '📦 Ingredient check completed 08:15'],
        actions: [
          {
            label: 'View order',
            variant: ['pill-btn'],
            intent: { message: 'Opening banquet order…' },
          },
          {
            label: 'Notify floor',
            variant: ['pill-btn', 'ghost'],
            intent: { message: 'Alerting banquet manager…' },
          },
        ],
      },
    ],
    maintenance: [
      {
        role: 'Maintenance',
        status: { label: 'Due 09:45', tone: 'priority-high' },
        title: 'AC airflow Rm 217',
        description: 'Replace clogged filter and run diagnostics · guest reported weak cooling.',
        meta: ['🛠️ Assigned to Samuel O.', '📋 Parts kit M-Filter-12 staged at engineering'],
        actions: [
          {
            label: 'Start ticket',
            variant: ['pill-btn'],
            intent: { message: 'Starting maintenance ticket…' },
          },
          {
            label: 'Resolved',
            variant: ['pill-btn', 'ghost'],
            intent: { message: 'Closing maintenance ticket…' },
          },
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
        {
          type: 'input',
          label: 'Guest or booking #',
          placeholder: 'Search name or REF123',
          required: true,
        },
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
        {
          type: 'textarea',
          label: 'Special instructions',
          placeholder: 'Allergies, VIP notes, etc.',
        },
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
      actions: [{ label: 'Start', intent: { message: 'Starting check-in flow…' } }],
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
      actions: [{ label: 'Bill', intent: { message: 'Preparing billing summary…' } }],
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
      actions: [{ label: 'Assign', intent: { message: 'Assigning room…' } }],
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
      actions: [{ label: 'Confirm', intent: { message: 'Confirming transfer…' } }],
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
          {
            tone: 'high',
            headline: 'Escalated guest support',
            description: 'Rm 305 requested late checkout • Await manager approval',
          },
          {
            tone: 'medium',
            headline: 'Maintenance follow-up',
            description: 'Rm 217 shower pressure fix scheduled at 14:00',
          },
          {
            tone: 'low',
            headline: 'Welcome amenity',
            description: 'Deliver honeymoon package to Rm 819 before 16:00',
          },
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
        {
          title: 'Rooms awaiting turnover',
          trend: { label: '8 priority', tone: 'warning' },
          metric: '18',
          actions: [{ label: 'View roster', intent: { message: 'Opening turnover roster…' } }],
        },
        {
          title: 'Inspections today',
          trend: { label: 'On track', tone: 'positive' },
          metric: '12',
          actions: [{ label: 'Inspection route', intent: { message: 'Viewing inspection plan…' } }],
        },
        {
          title: 'Linen stock',
          trend: { label: 'Next delivery 15:00', tone: 'neutral' },
          metric: '92%',
          actions: [{ label: 'Restock log', intent: { message: 'Opening restock log…' } }],
        },
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
        {
          title: 'Orders in queue',
          trend: { label: '2 delayed', tone: 'warning' },
          metric: '11',
          actions: [
            { label: 'Ticket screen', intent: { message: 'Opening kitchen ticket view…' } },
          ],
        },
        {
          title: 'Chef stations ready',
          trend: { label: 'All staffed', tone: 'positive' },
          metric: '5',
          actions: [{ label: 'Shift notes', intent: { message: 'Viewing culinary shift notes…' } }],
        },
        {
          title: 'Allergens flagged',
          trend: { label: '4 alerts', tone: 'negative' },
          metric: '9',
          actions: [{ label: 'Review tags', intent: { message: 'Opening allergen tracker…' } }],
        },
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
        {
          title: 'Open tickets',
          trend: { label: '2 urgent', tone: 'warning' },
          metric: '7',
          actions: [{ label: 'Ticket board', intent: { message: 'Opening maintenance board…' } }],
        },
        {
          title: 'Preventive tasks today',
          trend: { label: 'On schedule', tone: 'positive' },
          metric: '5',
          actions: [{ label: 'Maintenance plan', intent: { message: 'Viewing preventive plan…' } }],
        },
        {
          title: 'Parts inventory',
          trend: { label: '3 low items', tone: 'neutral' },
          metric: '87%',
          actions: [{ label: 'Order supplies', intent: { message: 'Preparing supply order…' } }],
        },
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
      {
        room: '101',
        type: 'Standard',
        status: 'Vacant clean',
        next: 'Ready for walk-in',
        assigned: '—',
      },
      {
        room: '214',
        type: 'Standard',
        status: 'Occupied',
        next: 'Guest checkout 11:00',
        assigned: '—',
      },
      {
        room: '305',
        type: 'Deluxe',
        status: 'Turnover',
        next: 'VIP setup by 12:00',
        assigned: 'Maria L.',
      },
      {
        room: '407',
        type: 'Suite',
        status: 'Occupied',
        next: 'Turndown 19:00',
        assigned: 'Evening team',
      },
      {
        room: '512',
        type: 'Deluxe',
        status: 'Vacant clean',
        next: 'Hold for 15:00 arrival',
        assigned: '—',
      },
      {
        room: '624',
        type: 'Standard',
        status: 'Turnover',
        next: 'Deep clean 10:30',
        assigned: 'Omar R.',
      },
      {
        room: '811',
        type: 'Suite',
        status: 'Maintenance',
        next: 'Railing inspection',
        assigned: 'Maintenance',
      },
    ],
    notes: [
      'Turnover priority · Levels 3 & 5 (conference block)',
      'Inspections due · 204, 305, 407, 612',
      'Linen status · Stock sufficient • Next delivery 15:00',
      'Guest requests · 318 hypoallergenic • 411 crib • 706 playpen',
    ],
  },
  shiftBookings: [
    {
      guest: 'Jane Smith',
      room: '101',
      type: 'Arrival',
      step: 'Check-in 09:30',
      notes: 'VIP • Welcome drinks ready',
    },
    {
      guest: 'Parker Family',
      room: '706',
      type: 'Arrival',
      step: 'Check-in 11:00',
      notes: 'Connecting rooms • Kids amenities',
    },
    {
      guest: 'Ahmed Khan',
      room: '217',
      type: 'Arrival',
      step: 'ETA 10:15',
      notes: 'Notify maintenance once cleared',
    },
    {
      guest: 'Michael Johnson',
      room: '305',
      type: 'Departure',
      step: 'Checkout 11:00',
      notes: 'Balance $220 • Late checkout review',
    },
    {
      guest: 'Laura Chen',
      room: '408',
      type: 'Departure',
      step: 'Checkout 09:45',
      notes: 'Airport transfer 10:00',
    },
  ],
  upcomingReservations: [
    {
      summary: 'Nov 3 • Rivera Family • Suite 910',
      details: 'Birthday package • Early check-in 13:00',
    },
    { summary: 'Nov 4 • Green Corp • 5 Deluxe rooms', details: 'Conference block • Shuttle 18:30' },
    { summary: 'Nov 5 • Sarah Patel • Room 802', details: 'Loyalty platinum • Prefers quiet wing' },
    {
      summary: 'Nov 6 • Bridal Party • Skyline Suite',
      details: 'Pre-arrival styling • Champagne 17:00',
    },
    {
      summary: 'Nov 7 • Tech Expo • 12 rooms',
      details: 'Hybrid payment • Meeting room B reserved',
    },
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
        actions: [
          { label: 'Adjust', intent: { message: 'Adjusting schedule…' } },
          { label: 'Notify guest', intent: { message: 'Calling room 221…' } },
        ],
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
    subtitle:
      'Guest satisfaction stands at 92%. You have 15 new bookings and 8 arrivals to steward today.',
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
      rating:
        '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>',
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
      description:
        'Six reservations confirmed · Couples suite prepared with lavender essence and bespoke refreshments.',
    },
    {
      title: "Chef's Table · Horizon Brasserie",
      description:
        'Seasonal tasting menu finalized · Executive Chef Laurent greeting VIP party at 19:30.',
    },
    {
      title: 'Marina Concierge',
      description:
        'Sunset yacht charter arranged for Suite 507 · Champagne and canapé service dockside.',
    },
    {
      title: 'Meetings & Events',
      description: 'Azure Ballroom set for 120-delegate summit · AV rehearsal scheduled for 14:00.',
    },
  ],
  reports: [
    {
      title: 'Occupancy & ADR',
      description:
        'Week-to-date occupancy at 86% with ADR of $482. Forecast indicates 4% uplift over prior month.',
    },
    {
      title: 'Guest Sentiment',
      description:
        'Voice-of-guest score at 4.82/5 · Concierge response times noted for excellence.',
    },
    {
      title: 'F&B Revenue',
      description:
        'Restaurants pacing 12% above target · Afternoon tea service popular with executive floors.',
    },
    {
      title: 'Maintenance Outlook',
      description:
        'Seven active work orders · Rooftop pool filtration upgrade scheduled overnight.',
    },
  ],
  settings: [
    {
      icon: 'fas fa-user-shield',
      label: 'Access Management · Update role credentials and multi-factor policies',
    },
    {
      icon: 'fas fa-credit-card',
      label: 'Billing Ledger · Configure folio routing and settlement rules',
    },
    {
      icon: 'fas fa-bell',
      label: 'Alert Centre · Tailor escalation paths for guest and operational notices',
    },
    {
      icon: 'fas fa-door-closed',
      label: 'Room Controls · Synchronize smart lock schedules and energy presets',
    },
    {
      icon: 'fas fa-globe',
      label: 'Global Preferences · Manage currency, language, and communication styles',
    },
    {
      icon: 'fas fa-database',
      label: 'Data Archive · Schedule compliance exports and retention windows',
    },
  ],
  revenueSeries: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [32000, 38000, 42000, 48000, 52000, 61000, 68000, 72000, 65000, 71000, 78000, 85000],
  },
};
const staffProfiles = {
  alex: {
    role: 'frontdesk',
    roleLabel: 'Front Desk',
    name: 'Alex Johnson',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    ext: '214',
  },
  maria: {
    role: 'housekeeping',
    roleLabel: 'Housekeeping',
    name: 'Maria Lopez',
    shiftStart: '08:00',
    shiftEnd: '16:00',
    ext: '305',
  },
  nina: {
    role: 'kitchen',
    roleLabel: 'Kitchen',
    name: 'Chef Nina',
    shiftStart: '06:00',
    shiftEnd: '14:00',
    ext: '118',
  },
  samuel: {
    role: 'maintenance',
    roleLabel: 'Maintenance',
    name: 'Samuel Okoro',
    shiftStart: '09:00',
    shiftEnd: '17:00',
    ext: '450',
  },
};
const customerDashboardState = {
  profile: {
    name: 'Joseph Kilonzo',
    salutation: 'Welcome back',
    subtext:
      'Your suite has been refreshed, the concierge is standing by, and bespoke experiences are ready whenever you are. Enjoy exclusive lounge access, personal itinerary updates, and handpicked city adventures tailored to your taste.',
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
      description:
        'Tailor housekeeping times, add celebration touches, or schedule spa rituals before you arrive.',
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
        addons: [{ label: 'Airport shuttle', tone: 'warning' }],
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
        {
          label: 'Download invoices',
          variant: ['btn', 'primary'],
          intent: { fn: 'gotoSection', args: ['receipts'] },
        },
        {
          label: 'View current bill',
          variant: ['btn', 'ghost'],
          intent: { fn: 'showPaymentReceipt', args: ['BILL001'] },
        },
      ],
    },
    methods: {
      entries: [
        { label: 'Primary card', value: 'Amex ending ·· 4821 · Auto-pay enabled' },
        { label: 'Billing email', value: 'billing@josephkilonzo.com' },
        { label: 'Backup option', value: 'Visa ending ·· 9910 · Requires verification' },
      ],
      actions: [
        {
          label: 'Settle balance',
          variant: ['btn', 'primary'],
          intent: { message: 'Opening secure payment portal…' },
        },
        {
          label: 'Request statement',
          variant: ['btn', 'ghost'],
          intent: { fn: 'gotoSection', args: ['support'] },
        },
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
        actions: [{ label: 'Receipt', intent: { fn: 'showPaymentReceipt', args: ['BILL006'] } }],
      },
      {
        reference: 'BILL005',
        description: 'Mini Bar Selection',
        date: 'Oct 26',
        amount: '$95.00',
        status: { label: 'Paid', tone: 'confirmed' },
        actions: [{ label: 'Receipt', intent: { fn: 'showPaymentReceipt', args: ['BILL005'] } }],
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
          {
            label: 'Download PDF',
            variant: ['btn', 'booking-cta'],
            intent: { fn: 'downloadReceipt', args: ['BILL001'] },
          },
          {
            label: 'View summary',
            variant: ['btn', 'ghost'],
            intent: { fn: 'showPaymentReceipt', args: ['BILL001'] },
          },
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
          {
            label: 'Download PDF',
            variant: ['btn', 'booking-cta'],
            intent: { fn: 'downloadReceipt', args: ['BILL006'] },
          },
          {
            label: 'View summary',
            variant: ['btn', 'ghost'],
            intent: { fn: 'showPaymentReceipt', args: ['BILL006'] },
          },
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
          {
            label: 'Download PDF',
            variant: ['btn', 'booking-cta'],
            intent: { fn: 'downloadReceipt', args: ['BILL005'] },
          },
          {
            label: 'View summary',
            variant: ['btn', 'ghost'],
            intent: { fn: 'showPaymentReceipt', args: ['BILL005'] },
          },
        ],
      },
    ],
    actions: [
      {
        label: 'Export all receipts',
        variant: ['btn', 'primary'],
        intent: { message: 'Exporting CSV & PDF bundle…' },
      },
      {
        label: 'Back to payments',
        variant: ['btn', 'ghost'],
        intent: { fn: 'gotoSection', args: ['payments'] },
      },
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
        {
          label: 'Confirm holds',
          variant: ['btn', 'primary'],
          intent: { fn: 'startBooking', args: ['Concierge follow-up'] },
        },
        {
          label: 'Message concierge',
          variant: ['btn', 'ghost'],
          intent: { fn: 'gotoSection', args: ['support'] },
        },
      ],
    },
    list: [
      {
        experience: "Chef's Table Dinner",
        schedule: 'Nov 15 · 7:00 PM',
        guests: '2',
        status: { label: 'Confirmed', tone: 'confirmed' },
        notes: 'Wine pairing upgrade',
        actions: [{ label: 'Modify', intent: { fn: 'viewAll', args: ['reservations'] } }],
      },
      {
        experience: 'Couples Spa Ritual',
        schedule: 'Nov 16 · 9:30 AM',
        guests: '2',
        status: { label: 'Confirmed', tone: 'confirmed' },
        notes: 'Aromatherapy add-on',
        actions: [{ label: 'Adjust', intent: { fn: 'viewAll', args: ['reservations'] } }],
      },
      {
        experience: 'Sunset Cruise',
        schedule: 'Nov 18 · 5:45 PM',
        guests: '2',
        status: { label: 'Pending', tone: 'pending' },
        notes: 'Awaiting final confirmation',
        actions: [{ label: 'Confirm', intent: { fn: 'viewAll', args: ['reservations'] } }],
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
        {
          label: 'Open live tracker',
          variant: ['btn', 'primary'],
          intent: { fn: 'gotoSection', args: ['dashboard'] },
        },
        {
          label: 'Reorder favorites',
          variant: ['btn', 'ghost'],
          intent: { fn: 'reorder', args: ['ORD010'] },
        },
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
        actions: [{ label: 'Status', intent: { fn: 'trackOrder', args: ['ORD007'] } }],
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
        {
          label: 'Priority services',
          value: 'Late checkout · Experience curation · Special amenities',
        },
      ],
      actions: [
        {
          label: 'View concierge plan',
          variant: ['btn', 'primary'],
          intent: { fn: 'gotoSection', args: ['reservations'] },
        },
        {
          label: 'Track dining request',
          variant: ['btn', 'ghost'],
          intent: { fn: 'gotoSection', args: ['orders'] },
        },
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
          {
            label: 'Request call back',
            variant: ['btn', 'ghost'],
            intent: { fn: 'startBooking', args: ['Concierge call back'] },
          },
          {
            label: 'Manage stay',
            variant: ['btn', 'primary'],
            intent: { fn: 'gotoSection', args: ['bookings'] },
          },
        ],
      },
      {
        title: '💳 Billing desk',
        badge: { label: 'Daily 06:00-23:00', tone: 'neutral' },
        highlight: 'billing@championhotel.com',
        meta: 'Escalations respond in 15m',
        description: 'Clarify invoices, pre-authorizations, or secure payment links instantly.',
        actions: [
          {
            label: 'View receipts',
            variant: ['btn', 'ghost'],
            intent: { fn: 'gotoSection', args: ['receipts'] },
          },
          {
            label: 'Settle balance',
            variant: ['btn', 'primary'],
            intent: { fn: 'gotoSection', args: ['payments'] },
          },
        ],
      },
      {
        title: '🍽️ Dining liaison',
        badge: { label: 'Peak 17:00-21:00', tone: 'warning' },
        highlight: 'ext. 884 · Lumière',
        meta: "Chef's table concierge",
        description: 'Coordinate in-suite dining, dietary requirements, and chef experiences.',
        actions: [
          {
            label: 'Track orders',
            variant: ['btn', 'ghost'],
            intent: { fn: 'gotoSection', args: ['orders'] },
          },
          {
            label: 'Book tasting',
            variant: ['btn', 'primary'],
            intent: { fn: 'startBooking', args: ['Private dining consultation'] },
          },
        ],
      },
    ],
  },
};