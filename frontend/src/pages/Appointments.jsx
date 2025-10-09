import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Appointments = () => {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/my-appointments');
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm(t('appointments.cancelConfirm'))) {
      return;
    }

    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel`);
      if (response.data.success) {
        toast.success(t('appointments.cancelSuccess'));
        fetchAppointments();
      }
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getServiceName = (service) => {
    if (!service || !service.name) return 'Service';
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    return name[i18n.language] || name.en || 'Service';
  };

  const filterAppointments = () => {
    const now = new Date();
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      
      if (filter === 'upcoming') {
        return aptDate >= now && apt.status !== 'cancelled';
      } else if (filter === 'past') {
        return aptDate < now || apt.status === 'completed';
      } else if (filter === 'cancelled') {
        return apt.status === 'cancelled';
      }
      return true;
    });
  };

  const filteredAppointments = filterAppointments();

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t('profile.myAppointments')}
        </h1>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-4 px-4 font-medium transition-colors ${
                filter === tab
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t(`appointments.${tab}`)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {t(`appointments.${appointment.status}`)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <User size={18} className="mr-2" />
                        <span className="font-medium">{appointment.barber?.user?.name}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Calendar size={18} className="mr-2" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Clock size={18} className="mr-2" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                      </div>
                      
                      <div className="text-gray-700">
                        <span className="font-medium">{t('booking.selectService')}:</span> {getServiceName(appointment.service)}
                      </div>
                      
                      {appointment.notes && (
                        <div className="text-gray-600 text-sm">
                          <span className="font-medium">{t('booking.notes')}:</span> {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                    <div className="text-2xl font-bold text-primary-600 mb-4">
                      {appointment.finalPrice} ETB
                    </div>
                    
                    {appointment.status === 'confirmed' && new Date(appointment.date) > new Date() && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="flex items-center text-red-600 hover:text-red-700 font-medium"
                      >
                        <X size={18} className="mr-1" />
                        {t('appointments.cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('appointments.noAppointments')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
