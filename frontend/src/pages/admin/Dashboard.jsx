import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  DollarSign,
  TrendingUp,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchDashboardStats();
  }, [dateRange]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard', {
        params: dateRange
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: t('admin.dashboard') },
    { path: '/admin/appointments', icon: <Calendar size={20} />, label: t('admin.bookings') },
    { path: '/admin/customers', icon: <Users size={20} />, label: t('admin.customers') },
    { path: '/admin/barbers', icon: <Users size={20} />, label: 'Manage Barbers' },
    { path: '/admin/services', icon: <Scissors size={20} />, label: t('admin.manageServices') },
    { path: '/admin/expenses', icon: <DollarSign size={20} />, label: t('admin.manageExpenses') }
  ];

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h2>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                  location.pathname === item.path ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={
              <div>
                {/* Date Range Filter */}
                <div className="mb-6 flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 mb-1">{t('admin.revenue')}</p>
                        <p className="text-3xl font-bold">{stats?.totalRevenue || 0} ETB</p>
                      </div>
                      <DollarSign size={48} className="text-blue-200" />
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 mb-1">{t('admin.expenses')}</p>
                        <p className="text-3xl font-bold">{stats?.totalExpenses || 0} ETB</p>
                      </div>
                      <TrendingUp size={48} className="text-red-200" />
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 mb-1">{t('admin.profit')}</p>
                        <p className="text-3xl font-bold">{stats?.netProfit || 0} ETB</p>
                      </div>
                      <Package size={48} className="text-green-200" />
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 mb-1">{t('admin.bookings')}</p>
                        <p className="text-3xl font-bold">{stats?.totalBookings || 0}</p>
                      </div>
                      <Calendar size={48} className="text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Bookings by Status */}
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-4">Bookings by Status</h3>
                    {stats?.bookingsByStatus && stats.bookingsByStatus.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stats.bookingsByStatus}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry) => `${entry.status}: ${entry.count}`}
                          >
                            {stats.bookingsByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        No booking data available
                      </div>
                    )}
                  </div>

                  {/* New Customers */}
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-4">Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                        <span className="text-gray-700">New Customers</span>
                        <span className="text-2xl font-bold text-primary-600">{stats?.newCustomers || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                        <span className="text-gray-700">Total Bookings</span>
                        <span className="text-2xl font-bold text-primary-600">{stats?.totalBookings || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Services */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Top Services</h3>
                  {stats?.topServices && stats.topServices.length > 0 ? (
                    <div className="space-y-3">
                      {stats.topServices.map((service, index) => {
                        const serviceName = service.service?.name 
                          ? (typeof service.service.name === 'string' ? JSON.parse(service.service.name).en : service.service.name.en)
                          : 'Service';
                        return (
                          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                            <div>
                              <p className="font-semibold">{serviceName}</p>
                              <p className="text-sm text-gray-600">{service.count} bookings</p>
                            </div>
                            <p className="text-xl font-bold text-primary-600">{service.revenue || 0} ETB</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      No service data available
                    </div>
                  )}
                </div>
              </div>
            } />
            <Route path="/appointments" element={<AppointmentsManager />} />
            <Route path="/customers" element={<CustomersManager />} />
            <Route path="/barbers" element={<BarbersManager />} />
            <Route path="/services" element={<ServicesManager />} />
            <Route path="/expenses" element={<ExpensesManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Appointments Manager Component
const AppointmentsManager = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAppointment = async (id) => {
    if (!window.confirm('Mark this appointment as completed?')) return;
    try {
      await api.put(`/admin/appointments/${id}/complete`, {});
      toast.success('Appointment marked as completed');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to complete appointment');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('admin.bookings')}</h2>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barber</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((apt) => {
                const serviceName = apt.service?.name 
                  ? (typeof apt.service.name === 'string' ? JSON.parse(apt.service.name).en : apt.service.name.en)
                  : 'Service';
                return (
                  <tr key={apt.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{apt.customer?.user?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{apt.barber?.user?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{serviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(apt.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{apt.startTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{apt.finalPrice} ETB</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleCompleteAppointment(apt.id)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Mark Complete
                        </button>
                      )}
                      {apt.status === 'completed' && (
                        <span className="text-gray-500">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Barbers Manager Component
const BarbersManager = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    bio: '',
    specialties: '',
    experience: '',
    isActive: true
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await api.get('/barbers');
      if (response.data.success) {
        setBarbers(response.data.barbers);
      }
    } catch (error) {
      toast.error('Failed to load barbers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const barberData = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim())
      };

      if (editingBarber) {
        await api.put(`/barbers/${editingBarber.id}`, barberData);
        toast.success('Barber updated');
      } else {
        await api.post('/barbers', barberData);
        toast.success('Barber created');
      }
      
      setShowModal(false);
      fetchBarbers();
    } catch (error) {
      toast.error('Failed to save barber');
    }
  };

  const handleEdit = (barber) => {
    const specs = typeof barber.specialties === 'string' ? JSON.parse(barber.specialties) : barber.specialties;
    setEditingBarber(barber);
    setFormData({
      userId: barber.userId,
      bio: barber.bio || '',
      specialties: Array.isArray(specs) ? specs.join(', ') : '',
      experience: barber.experience || '',
      isActive: barber.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this barber?')) return;
    try {
      await api.delete(`/barbers/${id}`);
      toast.success('Barber deleted');
      fetchBarbers();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Barbers</h2>
        <button onClick={() => { setEditingBarber(null); setShowModal(true); }} className="btn-primary">Add Barber</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <div key={barber.id} className="card">
            <h3 className="text-lg font-semibold mb-2">{barber.user?.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{barber.experience} years experience</p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{barber.bio}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(barber)} className="btn-secondary flex-1">Edit</button>
              <button onClick={() => handleDelete(barber.id)} className="btn-outline flex-1 text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">{editingBarber ? 'Edit Barber' : 'Add Barber'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Bio</label><textarea className="input-field" rows="3" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Specialties (comma separated)</label><input type="text" className="input-field" value={formData.specialties} onChange={(e) => setFormData({ ...formData, specialties: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Experience (years)</label><input type="number" className="input-field" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} required /></div>
              <div className="flex gap-3"><button type="submit" className="btn-primary flex-1">{editingBarber ? 'Update' : 'Create'}</button><button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Customers Manager Component
const CustomersManager = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      if (response.data.success) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('admin.customers')}</h2>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Visits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty Points</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.user?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.user?.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.totalVisits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.totalSpent} ETB</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.loyaltyPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Services Manager Component
const ServicesManager = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: { am: '', om: '', ti: '', en: '' },
    description: { am: '', om: '', ti: '', en: '' },
    price: '',
    duration: '',
    category: 'haircut',
    loyaltyPoints: '',
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        name: JSON.stringify(formData.name),
        description: JSON.stringify(formData.description)
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, serviceData);
        toast.success('Service updated successfully');
      } else {
        await api.post('/services', serviceData);
        toast.success('Service created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    const description = typeof service.description === 'string' ? JSON.parse(service.description) : service.description;
    
    setEditingService(service);
    setFormData({
      name,
      description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      loyaltyPoints: service.loyaltyPoints,
      isActive: service.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: { am: '', om: '', ti: '', en: '' },
      description: { am: '', om: '', ti: '', en: '' },
      price: '',
      duration: '',
      category: 'haircut',
      loyaltyPoints: '',
      isActive: true
    });
  };

  const getServiceName = (service) => {
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    return name.en || name.am || 'Service';
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('admin.manageServices')}</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center">
          <Package size={20} className="mr-2" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{getServiceName(service)}</h3>
              <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{service.category}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-primary-600">{service.price} ETB</span>
              <span className="text-gray-600">{service.duration} min</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(service)} className="btn-secondary flex-1">Edit</button>
              <button onClick={() => handleDelete(service.id)} className="btn-outline flex-1 text-red-600 border-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Name (All Languages)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="English" className="input-field" value={formData.name.en} onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })} required />
                    <input type="text" placeholder="አማርኛ" className="input-field" value={formData.name.am} onChange={(e) => setFormData({ ...formData, name: { ...formData.name, am: e.target.value } })} required />
                    <input type="text" placeholder="Afaan Oromo" className="input-field" value={formData.name.om} onChange={(e) => setFormData({ ...formData, name: { ...formData.name, om: e.target.value } })} required />
                    <input type="text" placeholder="ትግርኛ" className="input-field" value={formData.name.ti} onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ti: e.target.value } })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Price (ETB)</label><input type="number" className="input-field" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></div>
                  <div><label className="block text-sm font-medium mb-1">Duration (min)</label><input type="number" className="input-field" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Category</label><select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option value="haircut">Haircut</option><option value="shave">Shave</option><option value="styling">Styling</option><option value="treatment">Treatment</option><option value="package">Package</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">Loyalty Points</label><input type="number" className="input-field" value={formData.loyaltyPoints} onChange={(e) => setFormData({ ...formData, loyaltyPoints: e.target.value })} required /></div>
                </div>
                <div><label className="flex items-center"><input type="checkbox" className="mr-2" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><span className="text-sm font-medium">Active</span></label></div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">{editingService ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Expenses Manager Component
const ExpensesManager = () => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'supplies',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/admin/expenses');
      if (response.data.success) {
        setExpenses(response.data.expenses);
      }
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/expenses', formData);
      toast.success('Expense added successfully');
      setShowModal(false);
      resetForm();
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/admin/expenses/${id}`);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'supplies',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false
    });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.manageExpenses')}</h2>
          <p className="text-gray-600 mt-1">Total: <span className="font-bold text-red-600">{totalExpenses.toFixed(2)} ETB</span></p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center">
          <DollarSign size={20} className="mr-2" />
          Add Expense
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{expense.category}</span>
                  </td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">{expense.amount} ETB</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="rent">Rent</option>
                    <option value="salary">Salary</option>
                    <option value="utilities">Utilities</option>
                    <option value="supplies">Supplies</option>
                    <option value="marketing">Marketing</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (ETB)</label>
                  <input type="number" step="0.01" className="input-field" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="input-field" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" className="input-field" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">Add Expense</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
