import React from 'react';
import { User } from '../../types';
import { MapPin, Briefcase, Award, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ColleagueCardProps {
  user: User;
  onViewProfile: (user: User) => void;
}

export const ColleagueCard: React.FC<ColleagueCardProps> = ({ user, onViewProfile }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-medium">
            {user.firstName[0]}{user.lastName[0]}
          </span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {user.firstName} {user.lastName}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <Briefcase className="h-4 w-4 mr-2" />
            <span className="text-sm">{user.position}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{user.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Joined {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {user.bio}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                <span>{user.certifications.length} certs</span>
              </div>
              <div>
                <span>{user.skills.length} skills</span>
              </div>
            </div>
            
            <button
              onClick={() => onViewProfile(user)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};