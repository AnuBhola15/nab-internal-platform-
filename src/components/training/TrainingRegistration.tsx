import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, BookOpen, CheckCircle } from 'lucide-react';
import { Training, TrainingRegistration } from '../../types';
import { database } from '../../utils/database';
import { useAuth } from '../../context/AuthContext';

export const TrainingRegistration: React.FC = () => {
  const [availableTrainings, setAvailableTrainings] = useState<Training[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<TrainingRegistration[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [registrationNotes, setRegistrationNotes] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    loadAvailableTrainings();
    if (currentUser) {
      loadMyRegistrations();
    }
  }, [currentUser]);

  const loadAvailableTrainings = () => {
    const allTrainings = database.getTrainings();
    const releasedTrainings = allTrainings.filter(training => training.isReleased);
    setAvailableTrainings(releasedTrainings);
  };

  const loadMyRegistrations = () => {
    if (currentUser) {
      const registrations = database.getRegistrationsByUser(currentUser.id);
      setMyRegistrations(registrations);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedTraining) return;

    const newRegistration: TrainingRegistration = {
      id: Date.now().toString(),
      trainingId: selectedTraining.id,
      userId: currentUser.id,
      status: 'pending',
      registeredAt: new Date().toISOString(),
      notes: registrationNotes
    };

    database.createTrainingRegistration(newRegistration);
    setMyRegistrations([...myRegistrations, newRegistration]);
    setShowRegistrationForm(false);
    setSelectedTraining(null);
    setRegistrationNotes('');
  };

  const isAlreadyRegistered = (trainingId: string) => {
    return myRegistrations.some(reg => reg.trainingId === trainingId);
  };

  const getRegistrationStatus = (trainingId: string) => {
    const registration = myRegistrations.find(reg => reg.trainingId === trainingId);
    return registration?.status || null;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRegistrationCount = (trainingId: string) => {
    return database.getRegistrationsByTraining(trainingId).length;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Training Sessions</h1>

      {/* Registration Form Modal */}
      {showRegistrationForm && selectedTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Register for Training</h2>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">{selectedTraining.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedTraining.description}</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={registrationNotes}
                    onChange={(e) => setRegistrationNotes(e.target.value)}
                    placeholder="Any specific requirements or questions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Available Trainings */}
      <div className="grid gap-6 mb-8">
        {availableTrainings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No training sessions are currently available.</p>
          </div>
        ) : (
          availableTrainings.map((training) => {
            const isRegistered = isAlreadyRegistered(training.id);
            const registrationStatus = getRegistrationStatus(training.id);
            const registrationCount = getRegistrationCount(training.id);
            const isFull = registrationCount >= training.capacity;

            return (
              <div key={training.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                      {isRegistered && registrationStatus && (
                        getStatusBadge(registrationStatus)
                      )}
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
                        {registrationCount}/{training.capacity} registered
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {!isRegistered && !isFull && (
                      <button
                        onClick={() => {
                          setSelectedTraining(training);
                          setShowRegistrationForm(true);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Register
                      </button>
                    )}
                    {isRegistered && (
                      <span className="text-sm text-gray-500">Already registered</span>
                    )}
                    {isFull && !isRegistered && (
                      <span className="text-sm text-red-500">Full capacity</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* My Registrations */}
      {myRegistrations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Training Registrations</h2>
          <div className="grid gap-4">
            {myRegistrations.map((registration) => {
              const training = database.getTrainingById(registration.trainingId);
              if (!training) return null;

              return (
                <div key={registration.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{training.title}</h3>
                      <p className="text-sm text-gray-500">
                        Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                      </p>
                      {registration.notes && (
                        <p className="text-sm text-gray-600 mt-1">{registration.notes}</p>
                      )}
                    </div>
                    {getStatusBadge(registration.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}; 