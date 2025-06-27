import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Feed } from './components/feed/Feed';
import { ColleaguesList } from './components/colleagues/ColleaguesList';
import { UserProfile } from './components/profile/UserProfile';
import { TrainingManagement } from './components/training/TrainingManagement';
import { TrainingRegistration } from './components/training/TrainingRegistration';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('feed');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'feed':
        return <Feed />;
      case 'colleagues':
        return <ColleaguesList />;
      case 'profile':
        return currentUser ? <UserProfile user={currentUser} isOwnProfile={true} /> : null;
      case 'training':
        return currentUser?.isAdmin ? (
          <TrainingManagement isAdmin={true} />
        ) : (
          <TrainingRegistration />
        );
      case 'certifications':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Certification management coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;