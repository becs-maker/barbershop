import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Clock, Scissors } from 'lucide-react';
import api from '../utils/api';
import { DEMO_SERVICES } from '../data/demoData';

const Services = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'haircut', 'shave', 'styling', 'treatment', 'package'];

  useEffect(() => {
    fetchServices();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((service) => service.category === selectedCategory);

  const getServiceName = (service) => {
    if (!service || !service.name) return '';
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    return name[i18n.language] || name.en || 'Service';
  };

  const getServiceDescription = (service) => {
    if (!service || !service.description) return '';
    const desc = typeof service.description === 'string' ? JSON.parse(service.description) : service.description;
    return desc[i18n.language] || desc.en || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-primary-600 font-bold">
            Service Menu
          </span>
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mt-2 mb-4">
            {t('services.title')}
          </h1>
          <p className="text-gray-600 text-lg">
            Crafted grooming for kids, teens, young adults, and classic gentlemen.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-charcoal-900 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-charcoal-700 hover:border-primary-400'
              }`}
            >
              {category === 'all' ? 'All' : t(`services.${category}`)}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredServices.map((service) => (
            <div key={service.id} className="card-hover flex flex-col justify-between">
              <div>
                {service.image ? (
                  <img
                    src={service.image}
                    alt={getServiceName(service)}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                ) : (
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-11 h-11 rounded-xl bg-charcoal-900 text-primary-300 flex items-center justify-center">
                      <Scissors size={20} />
                    </span>
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {t(`services.${service.category}`)}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-charcoal-900 mb-2">
                  {getServiceName(service)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {getServiceDescription(service)}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 mb-4">
                  <div className="flex items-center text-gray-500 text-sm font-medium">
                    <Clock size={16} className="mr-1.5 text-primary-600" />
                    <span>{service.duration} {t('booking.minutes')}</span>
                  </div>
                  <span className="text-2xl font-bold text-charcoal-900">
                    {service.price} <span className="text-xs font-semibold text-primary-700">ETB</span>
                  </span>
                </div>
                <Link
                  to={`/booking?service=${service.id}`}
                  className="btn-primary w-full text-center text-sm"
                >
                  {t('services.bookService')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-14 bg-white rounded-2xl border border-stone-200 max-w-md mx-auto">
            <p className="text-gray-500">No services found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
