import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star, Award, Scissors } from 'lucide-react';
import api from '../utils/api';
import { DEMO_BARBERS } from '../data/demoData';

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
      if (response.data.success && Array.isArray(response.data.barbers) && response.data.barbers.length > 0) {
        setBarbers(response.data.barbers);
      } else {
        setBarbers(DEMO_BARBERS);
      }
    } catch {
      setBarbers(DEMO_BARBERS);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (barber) => {
    if (barber.initials) return barber.initials;
    const name = barber.user?.name || 'B';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
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
            Master Craftsmen
          </span>
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mt-2 mb-4">
            {t('barbers.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Skilled barbers trained across classic scissor work, modern fades, and family cuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {barbers.map((barber) => {
            const specs = barber.specialties
              ? typeof barber.specialties === 'string'
                ? JSON.parse(barber.specialties)
                : barber.specialties
              : [];

            return (
              <div key={barber.id} className="card-hover flex flex-col justify-between text-center">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-charcoal-900 border-2 border-primary-400/70 mb-5 flex items-center justify-center overflow-hidden shadow-sm">
                    {barber.user?.avatar ? (
                      <img
                        src={barber.user.avatar}
                        alt={barber.user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-2xl font-bold text-primary-300">
                        {getInitials(barber)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-charcoal-900 mb-2">
                    {barber.user?.name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-charcoal-900">
                      <Star className="text-primary-500 fill-primary-500" size={16} />
                      {parseFloat(barber.ratingAverage || 4.8).toFixed(1)}
                      <span className="text-gray-400 font-normal">({barber.ratingCount || 0})</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Award size={16} className="text-primary-600" />
                      {barber.experience} {t('barbers.years')}
                    </span>
                  </div>

                  {barber.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {barber.bio}
                    </p>
                  )}

                  {specs.length > 0 && (
                    <div className="mb-6 w-full">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {specs.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-stone-100 border border-stone-200 text-charcoal-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            <Scissors size={11} className="text-primary-600" />
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to={`/booking?barber=${barber.id}`}
                  className="btn-primary w-full text-center text-sm"
                >
                  {t('barbers.bookWithBarber')}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Barbers;
