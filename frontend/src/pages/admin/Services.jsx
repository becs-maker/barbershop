import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminServices = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: { am: '', om: '', ti: '', en: '' },
    description: { am: '', om: '', ti: '', en: '' },
    price: '',
    duration: '',
    category: 'haircut',
    loyaltyPoints: '',
    isActive: true
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        ...formData,
        name: JSON.stringify(formData.name),
        description: JSON.stringify(formData.description)
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, serviceData);
        toast.success('Service updated successfully');
      } else {
        await api.post('/services', serviceData);
        toast.success('Service created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    const description = typeof service.description === 'string' ? JSON.parse(service.description) : service.description;
    
    setEditingService(service);
    setFormData({
      name,
      description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      loyaltyPoints: service.loyaltyPoints,
      isActive: service.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: { am: '', om: '', ti: '', en: '' },
      description: { am: '', om: '', ti: '', en: '' },
      price: '',
      duration: '',
      category: 'haircut',
      loyaltyPoints: '',
      isActive: true
    });
  };

  const getServiceName = (service) => {
    const name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
    return name.en || name.am || 'Service';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{getServiceName(service)}</h3>
              <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{service.category}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-primary-600">{service.price} ETB</span>
              <span className="text-gray-600">{service.duration} min</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="btn-secondary flex-1 flex items-center justify-center"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="btn-outline flex-1 flex items-center justify-center text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Service Names */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name (All Languages)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="English"
                      className="input-field"
                      value={formData.name.en}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="አማርኛ (Amharic)"
                      className="input-field"
                      value={formData.name.am}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, am: e.target.value } })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Afaan Oromo"
                      className="input-field"
                      value={formData.name.om}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, om: e.target.value } })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="ትግርኛ (Tigrinya)"
                      className="input-field"
                      value={formData.name.ti}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ti: e.target.value } })}
                      required
                    />
                  </div>
                </div>

                {/* Service Descriptions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (All Languages)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <textarea
                      placeholder="English"
                      className="input-field"
                      rows="2"
                      value={formData.description.en}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                    />
                    <textarea
                      placeholder="አማርኛ (Amharic)"
                      className="input-field"
                      rows="2"
                      value={formData.description.am}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, am: e.target.value } })}
                    />
                    <textarea
                      placeholder="Afaan Oromo"
                      className="input-field"
                      rows="2"
                      value={formData.description.om}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, om: e.target.value } })}
                    />
                    <textarea
                      placeholder="ትግርኛ (Tigrinya)"
                      className="input-field"
                      rows="2"
                      value={formData.description.ti}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ti: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="input-field"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="haircut">Haircut</option>
                      <option value="shave">Shave</option>
                      <option value="styling">Styling</option>
                      <option value="treatment">Treatment</option>
                      <option value="package">Package</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Points</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.loyaltyPoints}
                      onChange={(e) => setFormData({ ...formData, loyaltyPoints: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
