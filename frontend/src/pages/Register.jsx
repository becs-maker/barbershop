import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: i18n.language,
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await api.post('/auth/register', registerData);
      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success(t('auth.registerSuccess'));
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message
        || error.response?.data?.errors?.[0]?.msg
        || t('auth.registerError');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full card p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-charcoal-900 text-primary-300 flex items-center justify-center mx-auto mb-4">
            <Scissors size={22} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-charcoal-900">
            {t('auth.register')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-600">
              {t('auth.login')}
            </Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-charcoal-800 mb-1">
              {t('auth.name')}
            </label>
            <input id="name" name="name" type="text" required className="input-field" placeholder={t('auth.name')} value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-charcoal-800 mb-1">
              {t('auth.email')}
            </label>
            <input id="email" name="email" type="email" required className="input-field" placeholder={t('auth.email')} value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-charcoal-800 mb-1">
              {t('auth.phone')}
            </label>
            <input id="phone" name="phone" type="tel" required className="input-field" placeholder="+251 911 234 567" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-charcoal-800 mb-1">
              {t('auth.password')}
            </label>
            <input id="password" name="password" type="password" required minLength={6} className="input-field" placeholder={t('auth.password')} value={formData.password} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-charcoal-800 mb-1">
              {t('auth.confirmPassword')}
            </label>
            <input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} className="input-field" placeholder={t('auth.confirmPassword')} value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary mt-2 disabled:opacity-50">
            {loading ? t('common.loading') : t('auth.register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
