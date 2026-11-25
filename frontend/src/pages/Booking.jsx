import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import { DEMO_BARBERS, DEMO_SERVICES, DEMO_SLOTS } from '../data/demoData';

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
      if (response.data.success && Array.isArray(response.data.barbers) && response.data.barbers.length > 0) {
        setBarbers(response.data.barbers);
      } else {
        setBarbers(DEMO_BARBERS);
      }
    } catch {
      setBarbers(DEMO_BARBERS);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (response.data.success && Array.isArray(response.data.services) && response.data.services.length > 0) {
        setServices(response.data.services);
      } else {
        setServices(DEMO_SERVICES);
      }
    } catch {
      setServices(DEMO_SERVICES);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get('/appointments/available-slots', {
        params: { barberId: formData.barberId, date: formData.date }
      });
      if (response.data.success) {
        setAvailableSlots(response.data.slots);
      } else {
        setAvailableSlots(DEMO_SLOTS.map((time) => ({ time, available: true })));
      }
    } catch {
      setAvailableSlots(DEMO_SLOTS.map((time) => ({ time, available: true })));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to confirm a live booking');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/appointments', formData);
      if (response.data.success) {
        toast.success(t('booking.bookingSuccess') || 'Booking confirmed!');
        navigate('/appointments');
      }
    } catch (error) {
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
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    return name[i18n.language] || name.en || 'Service';
  };

  const getInitials = (barber) => {
    if (barber.initials) return barber.initials;
    const name = barber.user?.name || 'B';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const selectedBarber = barbers.find((b) => String(b.id) === String(formData.barberId));
  const selectedService = services.find((s) => String(s.id) === String(formData.serviceId));

  const canProceed = () => {
    if (step === 1) return formData.barberId && formData.serviceId;
    if (step === 2) return formData.date;
    if (step === 3) return formData.startTime;
    return false;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-primary-600 font-bold">
            Online Reservation
          </span>
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mt-2 mb-6">
            {t('booking.title')}
          </h1>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= s
                      ? 'bg-charcoal-900 text-primary-300 ring-2 ring-primary-500/40'
                      : 'bg-stone-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div className={`w-8 sm:w-14 h-1 rounded ${step > s ? 'bg-primary-500' : 'bg-stone-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
          {/* Step 1: Select Barber & Service */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-primary-600" />
                  <span>{t('booking.selectBarber')}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      onClick={() => setFormData({ ...formData, barberId: barber.id })}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        String(formData.barberId) === String(barber.id)
                          ? 'border-primary-500 bg-primary-50/70 shadow-sm'
                          : 'border-stone-200 hover:border-primary-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-charcoal-900 text-primary-300 flex items-center justify-center font-serif font-bold shrink-0 overflow-hidden">
                          {barber.user?.avatar ? (
                            <img src={barber.user.avatar} alt={barber.user?.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{getInitials(barber)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-charcoal-900 truncate">{barber.user?.name}</p>
                          <p className="text-xs text-gray-600 inline-flex items-center gap-1">
                            <Star size={12} className="text-primary-500 fill-primary-500" />
                            {parseFloat(barber.ratingAverage || 4.8).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal-900 mb-4">
                  {t('booking.selectService')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setFormData({ ...formData, serviceId: service.id })}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        String(formData.serviceId) === String(service.id)
                          ? 'border-primary-500 bg-primary-50/70 shadow-sm'
                          : 'border-stone-200 hover:border-primary-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-bold text-charcoal-900">{getServiceName(service)}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {service.duration} {t('booking.minutes')}
                          </p>
                        </div>
                        <p className="text-primary-700 font-bold shrink-0">{service.price} ETB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
                <Calendar size={20} className="text-primary-600" />
                <span>{t('booking.selectDate')}</span>
              </h2>
              <input
                type="date"
                className="input-field max-w-sm"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
                <Clock size={20} className="text-primary-600" />
                <span>{t('booking.selectTime')}</span>
              </h2>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setFormData({ ...formData, startTime: slot.time })}
                      className={`p-3 rounded-xl font-semibold text-sm transition-all ${
                        formData.startTime === slot.time
                          ? 'bg-charcoal-900 text-primary-300 ring-2 ring-primary-500'
                          : slot.available
                          ? 'bg-white border border-stone-200 hover:border-primary-400 text-charcoal-800'
                          : 'bg-stone-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No available time slots for this date.</p>
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                    Choose Another Date
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-charcoal-900">
                {t('booking.confirmBooking')}
              </h2>

              <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectBarber')}:</span>
                  <span className="font-bold text-charcoal-900">{selectedBarber?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectService')}:</span>
                  <span className="font-bold text-charcoal-900">{selectedService && getServiceName(selectedService)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectDate')}:</span>
                  <span className="font-bold text-charcoal-900">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('booking.selectTime')}:</span>
                  <span className="font-bold text-charcoal-900">{formData.startTime}</span>
                </div>
                <div className="flex justify-between text-base pt-3 border-t border-stone-200">
                  <span className="font-semibold text-charcoal-800">{t('booking.price')}:</span>
                  <span className="font-bold text-primary-700">{selectedService?.price} ETB</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-800 mb-1.5">
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
          <div className="flex justify-between mt-8 pt-6 border-t border-stone-100">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">
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
