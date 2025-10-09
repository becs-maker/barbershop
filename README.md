# Ethiopian Barbershop Management System

A comprehensive web application for managing a barbershop in Ethiopia with multilingual support (Amharic, Afaan Oromo, Tigrinya, English), online booking, customer loyalty programs, and admin dashboard.

## Features

### Customer Features
- 🌍 **Multilingual Support**: Amharic, Afaan Oromo, Tigrinya, and English
- 📅 **Online Booking**: Book appointments with preferred barbers
- ⭐ **Loyalty Program**: Earn points and get discounts
- 🎁 **Referral System**: Share referral codes and earn bonuses
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔔 **Notifications**: Email, SMS, and WhatsApp notifications

### Admin Features
- 📊 **Dashboard**: Revenue tracking, analytics, and charts
- 💰 **Financial Management**: Track expenses and calculate profit
- 👥 **Customer Management**: View customer profiles and history
- 📆 **Appointment Management**: Manage bookings and schedules
- 🔧 **Service Management**: Add and edit services
- 👨‍💼 **Barber Management**: Manage barber profiles and availability

### Social Media Integration
- Facebook page integration
- YouTube video gallery
- TikTok content display (optional)

## Tech Stack

### Frontend
- **React** 18.2 with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React i18next** for internationalization
- **Zustand** for state management
- **Recharts** for data visualization
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **MySQL** with Sequelize ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email notifications
- **Twilio** for SMS/WhatsApp
- **Helmet** for security
- **Express Rate Limit** for API protection

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=barbershop
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

5. Create the MySQL database:
```sql
CREATE DATABASE barbershop;
```

6. Seed the database with sample data:
```bash
node seed-direct.js
```

7. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Project Structure

```
barbershop/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── i18n/        # Translation files
│   │   ├── store/       # State management
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/
│   ├── index.html
│   └── package.json
└── docs/
    └── requirements.txt # Project requirements
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Appointments
- `GET /api/appointments/available-slots` - Get available time slots
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments` - Get all appointments (Admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Barbers
- `GET /api/barbers` - Get all barbers
- `GET /api/barbers/:id` - Get barber by ID
- `POST /api/barbers` - Create barber (Admin)
- `PUT /api/barbers/:id` - Update barber (Admin/Staff)

### Loyalty
- `GET /api/loyalty/my-points` - Get user loyalty points
- `GET /api/loyalty/rules` - Get loyalty rules
- `POST /api/loyalty/apply-referral` - Apply referral code

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/expenses` - Add expense
- `GET /api/admin/expenses` - Get expenses
- `PUT /api/admin/appointments/:id/complete` - Mark appointment complete

## Multilingual Support

The application supports four languages:
- **Amharic (am)** - Default
- **Afaan Oromo (om)**
- **Tigrinya (ti)**
- **English (en)**

Translation files are located in `frontend/src/i18n/locales/`.

## Deployment

### Backend Deployment (Render/Heroku/DigitalOcean)

1. Set environment variables on your hosting platform
2. Deploy the backend folder
3. Ensure MySQL database is configured and accessible
4. Run database migrations/seed scripts

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder
3. Set environment variable `VITE_API_URL` to your backend URL

## Configuration

### Email Notifications
Configure SMTP settings in backend `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### SMS/WhatsApp (Twilio)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Social Media APIs
```env
FACEBOOK_APP_ID=your_app_id
FACEBOOK_PAGE_ACCESS_TOKEN=your_token
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

## Default Test Accounts

After seeding the database with `node seed-direct.js`, you can use these test accounts:

**Admin Account:**
- Email: `admin@barbershop.com`
- Password: `admin123`

**Staff Account (Barber):**
- Email: `abebe@barbershop.com`
- Password: `staff123`

**Customer Account:**
- Email: `dawit@example.com`
- Password: `customer123`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, email info@barbershop.et or contact us through the application.

## Acknowledgments

- Ethiopian community for language translations
- Open source libraries and frameworks used in this project
- Contributors and testers

---

Built with ❤️ for the Ethiopian market
