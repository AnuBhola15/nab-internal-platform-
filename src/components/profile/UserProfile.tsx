import React from 'react';
import { User } from '../../types';
import { ArrowLeft, MapPin, Briefcase, Calendar, Award, Phone, Linkedin, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserProfileProps {
  user: User;
  onBack?: () => void;
  isOwnProfile?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, isOwnProfile = false }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Colleagues
        </button>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 h-32"></div>
        
        <div className="px-6 pb-6">
          <div className="flex items-start -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-full p-2 mr-6">
              <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            </div>
            
            <div className="flex-1 mt-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Briefcase className="h-5 w-5 mr-2" />
                <span className="text-lg">{user.position}</span>
                <span className="mx-2">•</span>
                <span className="text-lg">{user.department}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
                {user.certifications.length > 0 ? (
                  <div className="space-y-4">
                    {user.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Award className="h-5 w-5 text-yellow-600 mr-2" />
                              <h3 className="font-medium text-gray-900">{cert.name}</h3>
                              {cert.verified && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-1">Issued by {cert.issuer}</p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span>Obtained: {new Date(cert.dateObtained).toLocaleDateString()}</span>
                              {cert.expiryDate && (
                                <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                              )}
                            </div>
                            {cert.credentialId && (
                              <p className="text-xs text-gray-400 mt-1">
                                Credential ID: {cert.credentialId}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No certifications added yet.</p>
                )}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3" />
                    <span>{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-3" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span>{user.location}</span>
                  </div>
                  
                  {user.linkedIn && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Linkedin className="h-4 w-4 mr-3" />
                      <a href={`https://${user.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Professional Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-3" />
                    <span>
                      Joined {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-3" />
                    <span>{user.experience} experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};