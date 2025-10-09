import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    bio: '',
    specialties: '',
    experience: '',
    availability: [
      { dayOfWeek: 0, startTime: '10:00', endTime: '15:00' },
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }
    ],
    isActive: true
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchBarbers();
    fetchStaffUsers();
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

  const fetchStaffUsers = async () => {
    try {
      const response = await api.get('/users?role=staff');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to load staff users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const barberData = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim())
      };

      if (editingBarber) {
        await api.put(`/barbers/${editingBarber.id}`, barberData);
        toast.success('Barber updated successfully');
      } else {
        await api.post('/barbers', barberData);
        toast.success('Barber created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchBarbers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save barber');
    }
  };

  const handleEdit = (barber) => {
    const specialties = typeof barber.specialties === 'string' 
      ? JSON.parse(barber.specialties) 
      : barber.specialties;
    const availability = typeof barber.availability === 'string'
      ? JSON.parse(barber.availability)
      : barber.availability;
    
    setEditingBarber(barber);
    setFormData({
      userId: barber.userId,
      bio: barber.bio || '',
      specialties: Array.isArray(specialties) ? specialties.join(', ') : '',
      experience: barber.experience || '',
      availability: availability || formData.availability,
      isActive: barber.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this barber?')) return;
    
    try {
      await api.delete(`/barbers/${id}`);
      toast.success('Barber deleted successfully');
      fetchBarbers();
    } catch (error) {
      toast.error('Failed to delete barber');
    }
  };

  const resetForm = () => {
    setEditingBarber(null);
    setFormData({
      userId: '',
      bio: '',
      specialties: '',
      experience: '',
      availability: [
        { dayOfWeek: 0, startTime: '10:00', endTime: '15:00' },
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }
      ],
      isActive: true
    });
  };

  const updateAvailability = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index][field] = value;
    setFormData({ ...formData, availability: newAvailability });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Barbers</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Barber
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <div key={barber.id} className="card">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{barber.user?.name}</h3>
                <p className="text-sm text-gray-600">{barber.experience} years exp</p>
                <p className="text-sm text-yellow-600">⭐ {parseFloat(barber.ratingAverage || 0).toFixed(1)}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{barber.bio}</p>
            <div className="flex gap-2 mb-3">
              {(() => {
                const specs = typeof barber.specialties === 'string' 
                  ? JSON.parse(barber.specialties) 
                  : barber.specialties;
                return specs?.slice(0, 3).map((spec, i) => (
                  <span key={i} className="px-2 py-1 bg-primary-100 text-primary-600 rounded text-xs">
                    {spec}
                  </span>
                ));
              })()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(barber)}
                className="btn-secondary flex-1 flex items-center justify-center"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(barber.id)}
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingBarber ? 'Edit Barber' : 'Add New Barber'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingBarber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staff User</label>
                    <select
                      className="input-field"
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      required
                    >
                      <option value="">Select a staff member</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief description about the barber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialties (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="e.g., haircut, shave, styling"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Availability
                  </label>
                  <div className="space-y-2">
                    {formData.availability.map((slot, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="w-24 text-sm font-medium">{dayNames[slot.dayOfWeek]}</span>
                        <input
                          type="time"
                          className="input-field flex-1"
                          value={slot.startTime}
                          onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          className="input-field flex-1"
                          value={slot.endTime}
                          onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                        />
                      </div>
                    ))}
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
                    {editingBarber ? 'Update Barber' : 'Create Barber'}
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

export default AdminBarbers;
