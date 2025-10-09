# Quick Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- MongoDB - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Git (optional)

## Step-by-Step Setup

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit the `.env` file and configure at minimum:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/barbershop
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
```

Start MongoDB (if running locally):
```bash
# Windows
mongod

# Mac (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### 2. Frontend Setup

Open a NEW terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

The default `.env` should work:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 3. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Creating Your First Admin Account

1. Click "Register" in the navigation
2. Fill in the registration form
3. After registration, you'll need to manually update the user role in MongoDB

### Update User Role to Admin (MongoDB Compass or Shell)

Using MongoDB Compass:
1. Connect to `mongodb://localhost:27017`
2. Select `barbershop` database
3. Open `users` collection
4. Find your user and edit
5. Change `role` from `"customer"` to `"admin"`
6. Save

Using MongoDB Shell:
```bash
mongosh

use barbershop

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Testing the Application

### Customer Flow
1. Register a new account
2. Browse services at `/services`
3. View barbers at `/barbers`
4. Book an appointment at `/booking`
5. View your appointments at `/appointments`
6. Check your profile and loyalty points at `/profile`

### Admin Flow
1. Login with admin account
2. Access admin dashboard at `/admin`
3. View statistics and analytics
4. Manage appointments, customers, services

## Adding Sample Data

You can manually add services and barbers through the admin panel, or use MongoDB to insert sample data:

### Sample Service
```javascript
db.services.insertOne({
  name: {
    am: "ፀጉር መቁረጥ",
    om: "Rifeensa Muruu",
    ti: "ፀጉር ምቑራጽ",
    en: "Haircut"
  },
  description: {
    am: "ሙያዊ የፀጉር አስተካካይ አገልግሎት",
    om: "Tajaajila Rifeensa Ogummaa",
    ti: "ፕሮፌሽናል ኣገልግሎት ፀጉር",
    en: "Professional haircut service"
  },
  price: 200,
  duration: 30,
  category: "haircut",
  isActive: true,
  loyaltyPoints: 10
})
```

### Sample Barber (First create a staff user, then create barber profile)
```javascript
// First create a staff user
db.users.insertOne({
  name: "John Doe",
  email: "barber@example.com",
  phone: "+251911234567",
  password: "$2a$10$...", // Use bcrypt to hash password
  role: "staff",
  preferredLanguage: "en",
  isActive: true
})

// Then create barber profile using the user's _id
db.barbers.insertOne({
  user: ObjectId("user_id_here"),
  bio: "Experienced barber with 5 years of expertise",
  specialties: ["Haircut", "Shave", "Styling"],
  experience: 5,
  availability: [
    { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 5, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 6, startTime: "09:00", endTime: "15:00" }
  ],
  isActive: true
})
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is already in use

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is already in use
- Verify backend is running first

### Can't connect to MongoDB
- Ensure MongoDB service is running
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP whitelist is configured

### Translations not working
- Check browser console for errors
- Verify translation files exist in `frontend/src/i18n/locales/`
- Clear browser cache

## Optional Configurations

### Email Notifications (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate App Password
3. Update `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### SMS/WhatsApp (Twilio)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID and Auth Token
3. Update `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## Next Steps

1. Customize the application branding
2. Add your barbershop's actual services
3. Create barber profiles for your staff
4. Configure notification services
5. Set up social media integrations
6. Deploy to production

## Need Help?

- Check the main README.md for detailed documentation
- Review the requirements.txt in the docs folder
- Check error logs in the terminal

---

Happy coding! 🚀
