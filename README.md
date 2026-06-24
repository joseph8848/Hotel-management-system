# 🏨 Champion Hotel Management System

[🚀 Run Locally](http://localhost:8080) - *Start the server first with `node server.js`*

A comprehensive, modern hotel management system built with PHP, MySQL, and vanilla JavaScript. Features a luxury design with glassmorphism effects and real-time functionality.

## 📋 Project Overview

This system automates hotel operations including:

- **Online Booking System** - Real-time room availability checking
- **Guest Management** - Digital check-in/check-out processes
- **Kitchen Order Tracking** - Real-time order status updates
- **Billing & Invoicing** - Secure payment processing with PDF generation
- **Staff Management** - Role-based access control
- **Analytics Dashboard** - Real-time reporting for managers

## 🎯 Project Objectives

As per the project requirements document, this system achieves:

✅ **Automated Reservation System** - Reduces booking errors and conflicts  
✅ **Digital Check-in/Check-out** - Streamlined guest services  
✅ **Secure Billing System** - Encrypted transactions with audit trails  
✅ **Data Security** - HTTPS, password hashing, session management, CSRF protection  
✅ **Real-time Kitchen Orders** - Live order tracking and notifications  
✅ **Manager Reports** - Real-time analytics and insights

## 🚀 Features

### Customer Portal

- Online room booking with real-time availability
- View booking history and upcoming reservations
- Order room service and track delivery
- Digital invoices and payment receipts
- Profile management

### Staff Dashboard

- Manage room assignments and status
- Process check-ins and check-outs
- Handle kitchen orders
- View daily tasks and assignments
- Customer service tools

### Admin Dashboard

- Complete hotel operations overview
- User management (customers, staff)
- Room and inventory management
- Financial reports and analytics
- System settings and configuration

## 🛠️ Technology Stack

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern design with CSS variables, Grid, Flexbox
- **JavaScript (ES6+)** - Vanilla JS with modular architecture
- **Design System** - Custom component library with glassmorphism

### Backend

- **PHP 7.4+** - Server-side logic
- **MySQL 8.0+** - Relational database
- **PDO** - Database abstraction layer
- **Session Management** - Secure authentication

### Security

- Password hashing with bcrypt
- HTTPS enforcement
- SQL injection prevention (prepared statements)
- XSS protection
- CSRF tokens
- Session timeout
- Input validation and sanitization

## 📦 Installation

### Prerequisites

- PHP 7.4 or higher
- MySQL 8.0 or higher
- Apache/Nginx web server
- XAMPP/WAMP (for local development)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd champion-hotel-management
   ```

2. **Configure Database**
   - Create a new MySQL database named `hotel_management`
   - Import the schema:
     ```bash
     mysql -u root -p hotel_management < database/schema.sql
     ```

3. **Configure Database Connection**
   - Edit `config/db.php` with your database credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'hotel_management');
     define('DB_USER', 'your_username');
     define('DB_PASS', 'your_password');
     ```

4. **Set up Web Server**
   - Point your web server document root to the project directory
   - Ensure PHP is enabled
   - For XAMPP: Place project in `htdocs` folder

5. **Access the Application**
   - Navigate to `http://localhost/champion-hotel-management`
   - Default login credentials:
     - **Admin**: admin@championhotel.com / Admin!234
     - **Staff**: frontdesk@championhotel.com / Staff!234
     - **Customer**: guest@example.com / Guest!234

## 📁 Project Structure

```
champion-hotel-management/
├── assets/
│   ├── css/
│   │   ├── design-system.css    # Design tokens and components
│   │   ├── login.css            # Login page styles
│   │   └── booking.css          # Booking system styles
│   └── js/
│       ├── login.js             # Login functionality
│       └── booking.js           # Booking system logic
├── api/
│   └── booking.php              # Booking API endpoints
├── config/
│   └── db.php                   # Database configuration
├── database/
│   └── schema.sql               # Database schema
├── includes/
│   └── auth.php                 # Authentication helpers
├── Imgs/                        # Image assets
├── tests/                       # E2E tests
├── login.html                   # Login page
├── booking.html                 # Booking system
├── dashboard_admin.html         # Admin dashboard
├── dashboard_staff.html         # Staff dashboard
├── dashboard_customer.html      # Customer dashboard
├── menu_orders.html             # Kitchen orders
└── README.md
```

## 🔐 Security Features

1. **Authentication**
   - Secure password hashing (bcrypt)
   - Session-based authentication
   - Role-based access control
   - Session timeout (30 minutes)

2. **Data Protection**
   - SQL injection prevention (PDO prepared statements)
   - XSS protection (input sanitization)
   - CSRF token validation
   - HTTPS enforcement

3. **Audit Logging**
   - All critical actions logged
   - User activity tracking
   - Security event monitoring

## 🎨 Design System

The application uses a modern design system with:

- **Glassmorphism** - Frosted glass effects
- **Luxury Color Palette** - Deep blues, gold accents
- **Typography** - Playfair Display (headings) + Inter (body)
- **Responsive Design** - Mobile-first approach
- **Accessibility** - ARIA labels, keyboard navigation

### Color Palette

- Primary: `#1a365d` (Deep Blue)
- Secondary: `#c19a6b` (Gold)
- Accent: `#8b7355` (Bronze)
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)

## 📊 Database Schema

### Main Tables

- **users** - Customer, staff, and admin accounts
- **rooms** - Room inventory and details
- **reservations** - Booking records
- **food_orders** - Kitchen order tracking
- **invoices** - Billing and payments
- **audit_log** - Security and activity logs

## 🧪 Testing

Run end-to-end tests:

```bash
npm install
npm run test:e2e
```

## 📱 API Endpoints

### Booking API

- `GET /api/booking.php?action=available_rooms&check_in=YYYY-MM-DD&check_out=YYYY-MM-DD`
- `POST /api/booking.php?action=create_booking`

### Response Format

```json
{
  "success": true,
  "booking_reference": "CHM12345678",
  "reservation_id": 1,
  "total_amount": 50000,
  "message": "Booking created successfully"
}
```

## 🔄 Real-time Features

- **Kitchen Orders** - Server-Sent Events (SSE) for live updates
- **Room Availability** - AJAX polling for instant availability
- **Notifications** - Real-time alerts for staff and customers

## 📈 Future Enhancements

- [ ] Email notification system
- [ ] SMS alerts integration
- [ ] Payment gateway integration (M-Pesa, Stripe)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Customer review system
- [ ] Loyalty program

## 👥 User Roles

### Customer

- Book rooms online
- View reservations
- Order room service
- View invoices
- Update profile

### Staff

- Manage check-ins/check-outs
- Process orders
- Update room status
- Handle customer requests
- View daily tasks

### Admin

- Full system access
- User management
- Financial reports
- System configuration
- Analytics dashboard

## 🤝 Contributing

This is a student project for Zetech University. For contributions:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is developed as part of academic requirements at Zetech University.

## 👨‍💻 Developer

**Joseph Kilonzo Nzomo**  
Admission No: DCS 01/8430/2024  
Department of ICT and Engineering  
Zetech University

## 📞 Support

For issues or questions:

- Email: kilonzojoseph8848@gmail.com
- Project Supervisor: [Supervisor Name]

## 🙏 Acknowledgments

- Zetech University - Department of ICT and Engineering
- Project Supervisor
- All contributors and testers

---

© 2025 Champion Hotel Management System. All rights reserved.
