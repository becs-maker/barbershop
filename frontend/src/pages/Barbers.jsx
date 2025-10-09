import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Barbers = () => {
  const { t } = useTranslation();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

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
            {t('barbers.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Meet our team of experienced professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <div key={barber.id} className="card-hover">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                  {barber.user?.avatar ? (
                    <img
                      src={barber.user.avatar}
                      alt={barber.user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-500">👨‍💼</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {barber.user?.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="ml-1 font-medium">
                    {parseFloat(barber.ratingAverage || 0).toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({barber.ratingCount || 0} {t('barbers.rating')})
                  </span>
                </div>

                {/* Experience */}
                <div className="flex items-center text-gray-600 mb-4">
                  <Award size={18} className="mr-1" />
                  <span>
                    {barber.experience} {t('barbers.years')} {t('barbers.experience')}
                  </span>
                </div>

                {/* Bio */}
                {barber.bio && (
                  <p className="text-gray-600 text-center mb-4 line-clamp-3">
                    {barber.bio}
                  </p>
                )}

                {/* Specialties */}
                {barber.specialties && (() => {
                  const specs = typeof barber.specialties === 'string' ? JSON.parse(barber.specialties) : barber.specialties;
                  return specs && specs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {t('barbers.specialties')}:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {specs.map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <Link
                  to={`/booking?barber=${barber.id}`}
                  className="btn-primary w-full text-center mt-4"
                >
                  {t('barbers.bookWithBarber')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {barbers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No barbers available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Barbers;
