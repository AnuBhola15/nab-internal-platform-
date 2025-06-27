import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, MapPin, Clock, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { Training, TrainingRegistration, User } from '../../types';
import { database } from '../../utils/database';
import { useAuth } from '../../context/AuthContext';

interface TrainingManagementProps {
  isAdmin: boolean;
}

export const TrainingManagement: React.FC<TrainingManagementProps> = ({ isAdmin }) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    capacity: 20,
    startDate: '',
    endDate: '',
    location: '',
    instructor: ''
  });

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = () => {
    const allTrainings = database.getTrainings();
    setTrainings(allTrainings);
  };

  const loadRegistrations = (trainingId: string) => {
    const trainingRegistrations = database.getRegistrationsByTraining(trainingId);
    setRegistrations(trainingRegistrations);
  };

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTraining: Training = {
      id: Date.now().toString(),
      ...formData,
      isReleased: false,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || '',
      registrations: []
    };

    database.createTraining(newTraining);
    setTrainings([...trainings, newTraining]);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      duration: '',
      capacity: 20,
      startDate: '',
      endDate: '',
      location: '',
      instructor: ''
    });
  };

  const handleReleaseTraining = (trainingId: string) => {
    database.releaseTraining(trainingId);
    loadTrainings();
  };

  const handleDeleteTraining = (trainingId: string) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      const updatedTrainings = trainings.filter(t => t.id !== trainingId);
      setTrainings(updatedTrainings);
      // In a real app, you'd also delete from database
    }
  };

  const getStatusBadge = (isReleased: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isReleased 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isReleased ? 'Released' : 'Draft'}
      </span>
    );
  };

  const getRegistrationCount = (trainingId: string) => {
    return database.getRegistrationsByTraining(trainingId).length;
  };

  const getUserName = (userId: string) => {
    const user = database.getUserById(userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Training Management</h1>
        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Training
          </button>
        )}
      </div>

      {/* Create Training Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Training</h2>
          <form onSubmit={handleCreateTraining} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Category</option>
                  <option value="Development">Development</option>
                  <option value="Security">Security</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Business">Business</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2 days, 4 hours"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Create Training
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Training List */}
      <div className="grid gap-6">
        {trainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                  {getStatusBadge(training.isReleased)}
                </div>
                <p className="text-gray-600 mb-3">{training.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {training.duration}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(training.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {training.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {getRegistrationCount(training.id)}/{training.capacity} registered
                  </div>
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTraining(training)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {!training.isReleased && (
                    <button
                      onClick={() => handleReleaseTraining(training.id)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                      title="Release to wider audience"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTraining(training.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Registration Details Modal */}
      {selectedTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Registrations for {selectedTraining.title}</h2>
                <button
                  onClick={() => setSelectedTraining(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {registrations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No registrations yet</p>
                ) : (
                  registrations.map((registration) => (
                    <div key={registration.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{getUserName(registration.userId)}</p>
                          <p className="text-sm text-gray-500">
                            Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                          registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          registration.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.status}
                        </span>
                      </div>
                      {registration.notes && (
                        <p className="text-sm text-gray-600 mt-2">{registration.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 