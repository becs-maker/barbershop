import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Scissors, Award, Users, Clock } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Scissors className="w-12 h-12 text-primary-600" />,
      title: t('home.professionalService'),
      description: 'Expert haircuts and grooming services'
    },
    {
      icon: <Users className="w-12 h-12 text-primary-600" />,
      title: t('home.experiencedBarbers'),
      description: 'Skilled professionals with years of experience'
    },
    {
      icon: <Clock className="w-12 h-12 text-primary-600" />,
      title: 'Easy Booking',
      description: 'Book appointments online 24/7'
    },
    {
      icon: <Award className="w-12 h-12 text-primary-600" />,
      title: t('home.loyaltyRewards'),
      description: 'Earn points and get exclusive discounts'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {t('home.bookNow')}
              </Link>
              <Link to="/services" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.whyChooseUs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('services.title')}
            </h2>
            <p className="text-gray-600 text-lg">
              Professional grooming services tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: t('services.haircut'), price: '200 ETB', image: '💇‍♂️' },
              { name: t('services.shave'), price: '150 ETB', image: '🪒' },
              { name: t('services.styling'), price: '300 ETB', image: '✨' }
            ].map((service, index) => (
              <div key={index} className="card-hover text-center">
                <div className="text-6xl mb-4">{service.image}</div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-primary-600 font-bold text-lg mb-4">{service.price}</p>
                <Link to="/booking" className="btn-primary">
                  {t('services.bookService')}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="btn-outline">
              {t('common.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for a Fresh Look?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Book your appointment today and experience the best grooming service in Ethiopia
          </p>
          <Link to="/booking" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            {t('home.bookNow')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
