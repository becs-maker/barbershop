import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Award, Gift, Share2, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [customerData, setCustomerData] = useState(null);
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
    fetchLoyaltyData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/customers/profile');
      if (response.data.success) {
        setCustomerData(response.data.customer);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoyaltyData = async () => {
    try {
      const response = await api.get('/loyalty/my-points');
      if (response.data.success) {
        setLoyaltyData(response.data);
      }
    } catch (error) {
      console.error('Failed to load loyalty data');
    }
  };

  const copyReferralCode = () => {
    if (customerData?.referralCode) {
      navigator.clipboard.writeText(customerData.referralCode);
      toast.success('Referral code copied!');
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t('profile.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <User size={48} className="text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <p className="text-gray-600 mb-6">{user?.phone}</p>
                
                <button className="btn-outline w-full">
                  <Settings size={18} className="inline mr-2" />
                  {t('profile.editProfile')}
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Share2 size={20} className="mr-2" />
                {t('profile.referralCode')}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary-600 mb-2">
                  {customerData?.referralCode}
                </p>
                <button
                  onClick={copyReferralCode}
                  className="btn-secondary text-sm"
                >
                  Copy Code
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Share your referral code and earn bonus points!
              </p>
            </div>
          </div>

          {/* Stats & Loyalty */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-100 mb-1">{t('profile.loyaltyPoints')}</p>
                    <p className="text-3xl font-bold">{loyaltyData?.loyaltyPoints || 0}</p>
                  </div>
                  <Award size={48} className="text-primary-200" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">{t('profile.totalVisits')}</p>
                    <p className="text-3xl font-bold text-gray-900">{loyaltyData?.totalVisits || 0}</p>
                  </div>
                  <User size={48} className="text-gray-300" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">{t('profile.totalSpent')}</p>
                    <p className="text-3xl font-bold text-gray-900">{loyaltyData?.totalSpent || 0} ETB</p>
                  </div>
                  <Gift size={48} className="text-gray-300" />
                </div>
              </div>
            </div>

            {/* Available Discounts */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Gift size={24} className="mr-2" />
                {t('profile.availableDiscounts')}
              </h3>
              {loyaltyData?.availableDiscounts && loyaltyData.availableDiscounts.length > 0 ? (
                <div className="space-y-3">
                  {loyaltyData.availableDiscounts.map((discount, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-green-900">
                            {discount.type === 'percentage' 
                              ? `${discount.value}% OFF` 
                              : `${discount.value} ETB OFF`}
                          </p>
                          <p className="text-sm text-green-700">{discount.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-600">
                            {t('loyalty.expiresOn')}: {new Date(discount.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No available discounts at the moment. Keep visiting to earn rewards!
                </p>
              )}
            </div>

            {/* Visit History */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Visit History</h3>
              {(() => {
                const visitHistory = customerData?.visitHistory 
                  ? (typeof customerData.visitHistory === 'string' 
                      ? JSON.parse(customerData.visitHistory) 
                      : customerData.visitHistory)
                  : [];
                
                return visitHistory && visitHistory.length > 0 ? (
                  <div className="space-y-3">
                    {visitHistory.slice(0, 5).map((visit, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{new Date(visit.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">
                            Service - Barber
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-600">{visit.amount} ETB</p>
                          {visit.rating && (
                            <p className="text-sm text-yellow-600">⭐ {visit.rating}/5</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No visit history yet. Book your first appointment!
                  </p>
                );
              })()}
            </div>

            {/* Notification Preferences */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">
                {t('profile.notificationSettings')}
              </h3>
              <div className="space-y-3">
                {(() => {
                  const preferences = customerData?.preferences 
                    ? (typeof customerData.preferences === 'string' 
                        ? JSON.parse(customerData.preferences) 
                        : customerData.preferences)
                    : {};
                  const notifPrefs = preferences.notificationPreferences || {};
                  
                  return (
                    <>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">{t('profile.emailNotifications')}</span>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                          defaultChecked={notifPrefs.email}
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">{t('profile.smsNotifications')}</span>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                          defaultChecked={notifPrefs.sms}
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">{t('profile.whatsappNotifications')}</span>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                          defaultChecked={notifPrefs.whatsapp}
                        />
                      </label>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
