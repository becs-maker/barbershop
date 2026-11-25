import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Scissors, Award, Users, Clock, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DEMO_SERVICES } from '../data/demoData';

const Home = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon: <Scissors className="w-6 h-6 text-primary-600" />,
      title: t('home.professionalService'),
      description: 'Clean clipper fades, tailored scissor work, and crisp straight-razor finishes.'
    },
    {
      icon: <Users className="w-6 h-6 text-primary-600" />,
      title: t('home.experiencedBarbers'),
      description: 'Veteran barbers comfortable with every hair texture and every age group.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-600" />,
      title: t('home.modernEquipment'),
      description: 'Sanitized tools, warm eucalyptus towels, and calm lounge seating.'
    },
    {
      icon: <Award className="w-6 h-6 text-primary-600" />,
      title: t('home.loyaltyRewards'),
      description: 'Collect points on every haircut and unlock complimentary grooming perks.'
    }
  ];

  const generations = [
    {
      tag: 'Ages 6 – 19 · Kids & Teens',
      title: 'Sharp Fades & Clean Cuts',
      description: 'Patient, friendly barbers delivering neat school cuts, crisp tapers, and modern fades teens actually want.',
      points: ['Gentle junior & kids cuts', 'Clean taper & skin fades', 'Zero rush, family-friendly chairs']
    },
    {
      tag: 'Ages 20 – 40 · Modern Professionals',
      title: 'Precision Styling & Beard Care',
      description: 'Consistent, camera-ready cuts and structured beard sculpting built around busy workdays and weekends.',
      points: ['Razor-sharp line-ups', 'Balanced beard shaping', 'Fast 30-minute online booking']
    },
    {
      tag: 'Ages 40+ · Classic Gentlemen',
      title: 'Traditional Scissor & Hot Towel',
      description: 'Unhurried craftsmanship, classic side parts, relaxing steam towels, and soothing traditional shaves.',
      points: ['All-scissor tailored cuts', 'Hot-towel straight-razor shave', 'Quiet comfort & classic hospitality']
    }
  ];

  const featuredServices = DEMO_SERVICES.slice(0, 3);

  const getServiceName = (service) => {
    return service.name[i18n.language] || service.name.en;
  };

  const getServiceDesc = (service) => {
    return service.description[i18n.language] || service.description.en;
  };

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-charcoal-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(184, 130, 56, 0.35), transparent 55%), radial-gradient(circle at 20% 80%, rgba(184, 130, 56, 0.18), transparent 45%)'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/40 bg-charcoal-800/80 text-primary-200 text-xs uppercase tracking-[0.18em] font-semibold mb-7">
              <Sparkles size={14} className="text-primary-400" />
              <span>Addis Ababa · Classic Craft &amp; Modern Grooming</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              {t('home.title')}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              {t('home.subtitle')} — welcoming boys, young men, and seasoned gentlemen with unhurried precision and timeless style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn-primary px-8 py-3.5 text-base">
                <span>{t('home.bookNow')}</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-charcoal-700 bg-charcoal-800/70 text-white hover:border-primary-400 font-semibold transition-colors"
              >
                {t('home.learnMore')}
              </Link>
            </div>
          </div>

          {/* Info Strip */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-charcoal-800/75 border border-charcoal-700/90 rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-300 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">Open Hours</p>
                <p className="text-sm font-semibold text-white">Tue – Sun · 8:00 AM – 8:30 PM</p>
              </div>
            </div>
            <div className="bg-charcoal-800/75 border border-charcoal-700/90 rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-300 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">All-Ages Studio</p>
                <p className="text-sm font-semibold text-white">Junior Cuts · Fades · Classic Shaves</p>
              </div>
            </div>
            <div className="bg-charcoal-800/75 border border-charcoal-700/90 rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-300 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">4 Languages</p>
                <p className="text-sm font-semibold text-white">AM · OM · TI · EN Supported</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generational Style Section */}
      <section className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-primary-600 font-bold">
              Tailored For Every Generation
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mt-2 mb-4">
              One Barbershop. Every Style.
            </h2>
            <p className="text-gray-600">
              Whether it’s a first school haircut, a sharp weekend fade, or a relaxing hot-towel shave, every chair delivers the same care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {generations.map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-50 border border-stone-200 rounded-2xl p-7 flex flex-col justify-between hover:border-primary-400 transition-colors"
              >
                <div>
                  <span className="inline-block text-[11px] uppercase tracking-wider font-semibold text-primary-700 bg-primary-100 px-3 py-1 rounded-full mb-4">
                    {item.tag}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>
                <ul className="space-y-2.5 pt-4 border-t border-stone-200">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2.5 text-sm text-charcoal-800 font-medium">
                      <CheckCircle2 size={16} className="text-primary-600 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary-600 font-bold">
                Grooming Menu
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mt-1">
                {t('services.title')}
              </h2>
            </div>
            <Link to="/services" className="btn-outline text-sm">
              {t('common.viewAll')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredServices.map((service) => (
              <div key={service.id} className="card-hover flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-11 h-11 rounded-xl bg-charcoal-900 text-primary-300 flex items-center justify-center">
                      <Scissors size={20} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-stone-100 text-charcoal-700">
                      {service.duration} {t('booking.minutes')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-2">
                    {getServiceName(service)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {getServiceDesc(service)}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-2xl font-bold text-charcoal-900">
                    {service.price} <span className="text-xs font-semibold text-primary-700">ETB</span>
                  </span>
                  <Link to={`/booking?service=${service.id}`} className="btn-primary text-sm py-2 px-4">
                    {t('services.bookService')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-primary-600 font-bold">
              Our Standards
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mt-2">
              {t('home.whyChooseUs')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-charcoal-900 text-white border-t border-charcoal-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-charcoal-800 to-charcoal-950 border border-primary-500/30 p-10 md:p-14 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary-300 font-semibold">
              Walk-ins Welcome · Priority Online Booking
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 mb-4">
              Ready for a Sharp, Clean Look?
            </h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
              Reserve your favorite barber in under a minute and earn loyalty points every time you sit in the chair.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn-primary px-8 py-3.5 text-base">
                {t('home.bookNow')}
              </Link>
              <Link
                to="/barbers"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-charcoal-700 text-gray-200 hover:border-primary-400 font-semibold transition-colors"
              >
                {t('barbers.title')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
