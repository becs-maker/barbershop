import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-charcoal-950 text-gray-300 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif font-bold text-white mb-3">
              Addis Crown Barbershop
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('home.subtitle')}. Precision cuts, classic shaves, and welcoming hospitality for boys, teens, and gentlemen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-primary-300 font-semibold mb-4">
              {t('nav.services')}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/services" className="hover:text-white transition-colors">{t('services.haircut')}</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">{t('services.shave')}</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">{t('services.styling')}</Link></li>
              <li><Link to="/barbers" className="hover:text-white transition-colors">{t('nav.barbers')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-primary-300 font-semibold mb-4">
              Visit &amp; Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-primary-400 shrink-0" />
                <span>+251 911 234 567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-primary-400 shrink-0" />
                <span>info@barbershop.et</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-primary-400 shrink-0" />
                <span>Bole, Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-primary-300 font-semibold mb-4">
              Hours
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="text-primary-400 shrink-0" />
                <span>Tue – Sat: 8:00 AM – 8:30 PM</span>
              </li>
              <li className="pl-6">Sun: 9:00 AM – 6:00 PM</li>
              <li className="pt-1">
                <Link to="/booking" className="text-primary-300 hover:text-primary-200 font-semibold text-sm">
                  {t('home.bookNow')} →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-800 mt-10 pt-7 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Addis Crown Barbershop. All rights reserved.</p>
          <p>Classic Craft · Modern Style · All Ages</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
