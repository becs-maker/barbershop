# Admin Dashboard - Complete Guide ✅

## Overview
The admin dashboard now has **full functionality** for managing services and expenses directly from the sidebar menu.

## How to Access

1. **Login as Admin:**
   - Go to: http://localhost:3000/login
   - Email: `admin@barbershop.com`
   - Password: `admin123`

2. **Navigate to Admin Dashboard:**
   - After login, you'll see the admin sidebar
   - Click on any menu item to manage different sections

---

## Admin Menu Items

### 1. 📊 Dashboard (Main)
- **Path:** `/admin`
- **Features:**
  - View revenue, expenses, profit statistics
  - See total bookings and new customers
  - View top services chart
  - View bookings by status
  - Date range filter for reports

### 2. 📅 Bookings
- **Path:** `/admin/appointments`
- **Features:**
  - View all appointments in a table
  - See customer, barber, service, date, time
  - View appointment status (confirmed, completed, cancelled)
  - See prices for each booking

### 3. 👥 Customers
- **Path:** `/admin/customers`
- **Features:**
  - View all registered customers
  - See name, email, phone
  - View total visits, total spent
  - See loyalty points for each customer

### 4. ✂️ Manage Services
- **Path:** `/admin/services`
- **Features:**
  - **View all services** in grid cards
  - **Add Service Button** (top right)
    - Fill service name in 4 languages (English, Amharic, Oromo, Tigrinya)
    - Set price (ETB)
    - Set duration (minutes)
    - Choose category (haircut, shave, styling, treatment, package)
    - Set loyalty points
    - Toggle active/inactive
  - **Edit Service** - Click "Edit" button on any service card
  - **Delete Service** - Click "Delete" button (with confirmation)

### 5. 💰 Manage Expenses
- **Path:** `/admin/expenses`
- **Features:**
  - **View all expenses** in a table
  - **Total expenses** displayed at top
  - **Add Expense Button** (top right)
    - Select category (rent, salary, utilities, supplies, marketing, maintenance, other)
    - Enter amount (ETB)
    - Add description
    - Set date
  - **Delete Expense** - Click "Delete" in table row

---

## Step-by-Step: Add a New Service

1. Login as admin
2. Click **"Manage Services"** in sidebar
3. Click **"Add Service"** button (top right with package icon)
4. Fill in the form:
   - **English name:** e.g., "Premium Shave"
   - **አማርኛ name:** e.g., "ልዩ ፀጉር መላጨት"
   - **Afaan Oromo name:** e.g., "Haaduu Addaa"
   - **ትግርኛ name:** e.g., "ፍሉይ ምላጭ"
   - **Price:** e.g., 150
   - **Duration:** e.g., 30
   - **Category:** Select from dropdown
   - **Loyalty Points:** e.g., 15
   - **Active:** Check the box
5. Click **"Create"** button
6. Service appears immediately in the grid

---

## Step-by-Step: Add an Expense

1. Login as admin
2. Click **"Manage Expenses"** in sidebar
3. Click **"Add Expense"** button (top right with dollar icon)
4. Fill in the form:
   - **Category:** Select (rent, salary, utilities, etc.)
   - **Amount:** Enter amount in ETB
   - **Description:** Describe the expense
   - **Date:** Select date
5. Click **"Add Expense"** button
6. Expense appears in the table immediately
7. Total expenses updates automatically

---

## Features Implemented

### Services Management ✅
- ✅ Grid view of all services
- ✅ Add new service with multilingual support
- ✅ Edit existing services
- ✅ Delete services (with confirmation)
- ✅ Active/Inactive toggle
- ✅ Shows price, duration, category
- ✅ Modal form for add/edit

### Expenses Management ✅
- ✅ Table view of all expenses
- ✅ Add new expense
- ✅ Delete expenses (with confirmation)
- ✅ Category-based organization
- ✅ Date tracking
- ✅ Total expenses calculation
- ✅ Modal form for adding

### Other Sections ✅
- ✅ Appointments list with all details
- ✅ Customers list with loyalty info
- ✅ Dashboard with statistics and charts
- ✅ Fixed MongoDB syntax issues (changed `_id` to `id`)

---

## What You'll See

### Manage Services Page:
```
┌─────────────────────────────────────────┐
│  Manage Services        [Add Service]   │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Haircut  │  │  Shave   │  │Styling ││
│  │ 150 ETB  │  │ 100 ETB  │  │200 ETB ││
│  │ 30 min   │  │ 20 min   │  │ 40 min ││
│  │[Edit][Del]│  │[Edit][Del]│ │[E][D]  ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

### Manage Expenses Page:
```
┌─────────────────────────────────────────┐
│  Manage Expenses       [Add Expense]    │
│  Total: 5,000 ETB                       │
├─────────────────────────────────────────┤
│  Date       Category    Description  Amt│
│  2025-10-04 Rent       Monthly rent 3000│
│  2025-10-03 Supplies   Hair products 500│
│  2025-10-02 Utilities  Electricity   300│
└─────────────────────────────────────────┘
```

---

## API Endpoints Used

**Services:**
- `GET /api/services` - List all
- `POST /api/services` - Create new
- `PUT /api/services/:id` - Update
- `DELETE /api/services/:id` - Delete

**Expenses:**
- `GET /api/admin/expenses` - List all
- `POST /api/admin/expenses` - Create new
- `DELETE /api/admin/expenses/:id` - Delete

**Others:**
- `GET /api/appointments` - All appointments
- `GET /api/customers` - All customers
- `GET /api/admin/dashboard` - Statistics

---

## Fixed Issues

1. ✅ **Empty Services Page** - Now shows all services with Add button
2. ✅ **Empty Expenses Page** - Now shows all expenses with Add button
3. ✅ **MongoDB Syntax** - Fixed `_id` to `id` in appointments and customers tables
4. ✅ **Service Names** - Added JSON parsing for multilingual names
5. ✅ **Modal Forms** - Added proper forms for adding/editing

---

## Success! 🎉

Your admin dashboard is now fully functional with:
- ✅ Complete service management (add, edit, delete)
- ✅ Complete expense tracking (add, delete)
- ✅ All data displays correctly
- ✅ Buttons are visible and working
- ✅ Forms are user-friendly
- ✅ Multilingual support for services

**Everything is ready to use!** Login as admin and start managing your barbershop! 💈
