import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Booking = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    barberId: searchParams.get('barber') || '',
    serviceId: searchParams.get('service') || '',
    date: '',
    startTime: '',
    notes: ''
  });

  useEffect(() => {
    fetchBarbers();
    fetchServices();
  }, []);

  useEffect(() => {
    if (formData.barberId && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.barberId, formData.date]);

  const fetchBarbers = async () => {
    try {
      const response = await api.get('/barbers');
      if (response.data.success) {
        setBarbers(response.data.barbers);
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
      toast.error('Failed to load barbers. Using sample data.');
      // Provide fallback data for development
      setBarbers([
        { id: 'sample1', user: { name: 'John Doe' }, ratingAverage: 4.5 },
        { id: 'sample2', user: { name: 'Jane Smith' }, ratingAverage: 4.8 }
      ]);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services. Using sample data.');
      // Provide fallback data for development
      setServices([
        { id: 'service1', name: { en: 'Haircut' }, duration: 30, price: 200, category: 'haircut' },
        { id: 'service2', name: { en: 'Beard Trim' }, duration: 15, price: 100, category: 'shave' }
      ]);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      console.log('Fetching slots for:', { barberId: formData.barberId, date: formData.date });
      const response = await api.get('/appointments/available-slots', {
        params: {
          barberId: formData.barberId,
          date: formData.date
        }
      });
      console.log('Slots response:', response.data);
      if (response.data.success) {
        setAvailableSlots(response.data.slots);
        if (response.data.slots.length === 0) {
          toast.error('No available time slots for this date. Please try another date.');
        }
      }
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error(error.response?.data?.message || 'Failed to load available slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting booking:', formData);
      const response = await api.post('/appointments', formData);
      console.log('Booking response:', response.data);
      if (response.data.success) {
        toast.success(t('booking.bookingSuccess') || 'Booking confirmed!');
        navigate('/appointments');
      }
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.errors?.[0]?.msg
        || t('booking.bookingError') 
        || 'Failed to create booking';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = (service) => {
    if (!service || !service.name) return '';
    // Parse JSON string if needed
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    return name[i18n.language] || name.en || 'Service';
  };

  const selectedBarber = barbers.find(b => b.id === formData.barberId);
  const selectedService = services.find(s => s.id === formData.serviceId);

  const canProceed = () => {
    if (step === 1) return formData.barberId && formData.serviceId;
    if (step === 2) return formData.date;
    if (step === 3) return formData.startTime;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('booking.title')}
          </h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      step > s ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {/* Step 1: Select Barber & Service */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <User className="mr-2" />
                {t('booking.selectBarber')} & {t('booking.selectService')}
              </h2>

              {/* Barber Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.selectBarber')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      onClick={() => setFormData({ ...formData, barberId: barber.id })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.barberId == barber.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          {barber.user?.avatar ? (
                            <img src={barber.user.avatar} alt={barber.user?.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-xl">👨‍💼</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{barber.user?.name}</p>
                          <p className="text-sm text-gray-500">
                            ⭐ {parseFloat(barber.ratingAverage || 0).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.selectService')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setFormData({ ...formData, serviceId: service.id })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.serviceId == service.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{getServiceName(service)}</p>
                          <p className="text-sm text-gray-500">
                            {service.duration} {t('booking.minutes')}
                          </p>
                        </div>
                        <p className="text-primary-600 font-bold">{service.price} ETB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2" />
                {t('booking.selectDate')}
              </h2>
              <div>
                <input
                  type="date"
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Clock className="mr-2" />
                {t('booking.selectTime')}
              </h2>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setFormData({ ...formData, startTime: slot.time })}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        formData.startTime === slot.time
                          ? 'bg-primary-600 text-white'
                          : slot.available
                          ? 'bg-white border-2 border-gray-200 hover:border-primary-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg mb-4">No available time slots for this date</p>
                  <p className="text-gray-400 text-sm">The barber may not be working on this day. Please select a different date.</p>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary mt-4"
                  >
                    Choose Another Date
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">
                {t('booking.confirmBooking')}
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectBarber')}:</span>
                  <span className="font-semibold">{selectedBarber?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectService')}:</span>
                  <span className="font-semibold">{selectedService && getServiceName(selectedService)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectDate')}:</span>
                  <span className="font-semibold">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectTime')}:</span>
                  <span className="font-semibold">{formData.startTime}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">{t('booking.price')}:</span>
                  <span className="font-bold text-primary-600">{selectedService?.price} ETB</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.notes')} ({t('common.optional')})
                </label>
                <textarea
                  className="input-field"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('booking.notes')}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                {t('common.previous')}
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.next')}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : t('booking.confirmBooking')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
