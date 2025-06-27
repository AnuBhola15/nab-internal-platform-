import React from 'react';
import { Home, Users, User, Award, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'colleagues', label: 'Colleagues', icon: Users },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'certifications', label: 'Certifications', icon: Award },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Dashboard', icon: Shield }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.id === 'admin' && (
                    <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};