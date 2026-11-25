import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success(t('auth.loginSuccess'));
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.loginError'));
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
            {t('auth.login')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-primary-700 hover:text-primary-600">
              {t('auth.register')}
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-charcoal-800 mb-1.5">
              {t('auth.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder={t('auth.email')}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-charcoal-800 mb-1.5">
              {t('auth.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder={t('auth.password')}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
