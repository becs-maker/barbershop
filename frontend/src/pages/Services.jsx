import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

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
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Professional grooming services tailored to your needs
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All' : t(`services.${category}`)}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="card-hover">
              {service.image && (
                <img
                  src={service.image}
                  alt={getServiceName(service)}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {getServiceName(service)}
                </h3>
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                  {t(`services.${service.category}`)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {getServiceDescription(service)}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-500">
                  <Clock size={18} className="mr-1" />
                  <span>{service.duration} {t('booking.minutes')}</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">
                  {service.price} ETB
                </span>
              </div>
              <Link
                to={`/booking?service=${service.id}`}
                className="btn-primary w-full text-center"
              >
                {t('services.bookService')}
              </Link>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
