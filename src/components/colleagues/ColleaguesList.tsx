import React, { useState, useEffect } from 'react';
import { ColleagueCard } from './ColleagueCard';
import { UserProfile } from '../profile/UserProfile';
import { database } from '../../utils/database';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter } from 'lucide-react';

export const ColleaguesList: React.FC = () => {
  const { currentUser } = useAuth();
  const [colleagues, setColleagues] = useState<User[]>([]);
  const [filteredColleagues, setFilteredColleagues] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    const users = database.getUsers().filter(u => u.id !== currentUser?.id);
    setColleagues(users);
    setFilteredColleagues(users);
  }, [currentUser]);

  useEffect(() => {
    let filtered = colleagues;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter(user => user.department === filterDepartment);
    }

    setFilteredColleagues(filtered);
  }, [searchTerm, filterDepartment, colleagues]);

  const departments = [...new Set(colleagues.map(u => u.department))];

  if (selectedUser) {
    return (
      <UserProfile
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        isOwnProfile={false}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Colleagues</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search colleagues by name, position, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleagues.map(user => (
          <ColleagueCard
            key={user.id}
            user={user}
            onViewProfile={setSelectedUser}
          />
        ))}
      </div>

      {filteredColleagues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || filterDepartment
              ? 'No colleagues found matching your criteria.'
              : 'No colleagues found.'}
          </p>
        </div>
      )}
    </div>
  );
};