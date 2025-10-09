# Referral Code & Admin Management Guide

## ✅ Referral Code System

### For Customers - How to Use Referral Code

**During Registration:**
1. Go to http://localhost:3000/register
2. Fill in your details (name, email, phone, password)
3. **Enter referral code** in the "Referral Code" field (optional)
4. Click "Register"

**Benefits:**
- Get **50 loyalty points** instantly
- Get **10% discount** on your first booking (valid for 30 days)
- The person who referred you gets **100 loyalty points**

**Where to Find Your Referral Code:**
1. Login to your account
2. Go to **Profile** page
3. Your unique referral code is displayed in a box
4. Click "Copy Code" button to share with friends

### Backend Changes Made:
- ✅ Added referral code field to registration
- ✅ Automatic bonus points for both referrer and new customer
- ✅ Automatic 10% discount for new customer
- ✅ Validates referral code exists before applying

---

## ✅ Admin Management Pages

### For Admins - Manage Services

**Access:** Login as admin → Navigate to `/admin/services`

**Features:**
1. **View All Services** - See all services in grid layout
2. **Add New Service:**
   - Click "Add Service" button
   - Fill in service details in **all 4 languages** (English, Amharic, Oromo, Tigrinya)
   - Set price, duration, category, loyalty points
   - Toggle active/inactive status
   
3. **Edit Service:**
   - Click "Edit" button on any service card
   - Update any field
   - Save changes

4. **Delete Service:**
   - Click "Delete" button
   - Confirm deletion

**Service Fields:**
- Name (4 languages)
- Description (4 languages)
- Price (ETB)
- Duration (minutes)
- Category (haircut, shave, styling, treatment, package)
- Loyalty Points
- Active status

---

### For Admins - Manage Barbers

**Access:** Login as admin → Navigate to `/admin/barbers`

**Features:**
1. **View All Barbers** - See all barbers with ratings and experience
2. **Add New Barber:**
   - Click "Add Barber" button
   - Select a staff user (must have staff role)
   - Add bio and specialties
   - Set years of experience
   - Configure weekly availability (7 days)
   - Toggle active/inactive status

3. **Edit Barber:**
   - Click "Edit" button on any barber card
   - Update bio, specialties, experience
   - Modify availability schedule
   - Save changes

4. **Delete Barber:**
   - Click "Delete" button
   - Confirm deletion

**Barber Fields:**
- Staff User (linked to user account)
- Bio
- Specialties (comma separated: haircut, shave, styling)
- Years of Experience
- Weekly Availability:
  - Sunday: 10:00 AM - 3:00 PM
  - Monday-Friday: 9:00 AM - 6:00 PM
  - Saturday: 10:00 AM - 4:00 PM
- Active status

---

## Admin Routes Setup

Add these routes to your admin navigation:

```jsx
// In your admin layout/navigation
<Link to="/admin/services">Manage Services</Link>
<Link to="/admin/barbers">Manage Barbers</Link>
<Link to="/admin/dashboard">Dashboard</Link>
```

## Files Created:

1. **Frontend:**
   - `frontend/src/pages/admin/Services.jsx` - Service management page
   - `frontend/src/pages/admin/Barbers.jsx` - Barber management page
   - `frontend/src/pages/Register.jsx` - Updated with referral code field

2. **Backend:**
   - `backend/routes/auth.js` - Updated to handle referral codes during registration

## Test Credentials:

**Admin Account:**
- Email: admin@barbershop.com
- Password: admin123

**Customer Account:**
- Email: dawit@example.com
- Password: customer123
- Referral Code: REF001

## How to Test:

### Test Referral System:
1. Get referral code from existing customer (Profile page)
2. Logout
3. Register new account with that referral code
4. Check new account has 50 points and 10% discount
5. Check referrer account now has +100 points

### Test Admin Service Management:
1. Login as admin
2. Go to `/admin/services`
3. Click "Add Service"
4. Fill in all language fields
5. Save and verify service appears on customer Services page

### Test Admin Barber Management:
1. Login as admin
2. Go to `/admin/barbers`
3. Click "Add Barber"
4. Select staff user, set availability
5. Save and verify barber appears on customer Barbers page

## API Endpoints Used:

**Services:**
- GET `/api/services` - List all services
- POST `/api/services` - Create service (admin)
- PUT `/api/services/:id` - Update service (admin)
- DELETE `/api/services/:id` - Delete service (admin)

**Barbers:**
- GET `/api/barbers` - List all barbers
- POST `/api/barbers` - Create barber (admin)
- PUT `/api/barbers/:id` - Update barber (admin)
- DELETE `/api/barbers/:id` - Delete barber (admin)

**Referral:**
- POST `/api/auth/register` - Register with optional referral code
- GET `/api/loyalty/my-points` - View loyalty points and discounts

## Success! 🎉

Your barbershop system now has:
- ✅ Complete referral code system
- ✅ Admin pages to manage services
- ✅ Admin pages to manage barbers
- ✅ Multilingual support for all content
- ✅ Full CRUD operations for admin

Customers can share referral codes and earn rewards!
Admins can easily add/edit services and barbers!
