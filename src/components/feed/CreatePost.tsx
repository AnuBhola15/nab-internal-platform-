import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../utils/database';
import { Post } from '../../types';
import { Award, Briefcase, MessageSquare, Image } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<Post['type']>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !content.trim()) return;

    setIsSubmitting(true);
    
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: content.trim(),
      type: postType,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: []
    };

    database.createPost(newPost);
    setContent('');
    setPostType('general');
    onPostCreated();
    setIsSubmitting(false);
  };

  const postTypes = [
    { id: 'general', label: 'General', icon: MessageSquare },
    { id: 'achievement', label: 'Achievement', icon: Award },
    { id: 'certification', label: 'Certification', icon: Award },
    { id: 'project', label: 'Project', icon: Briefcase }
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {currentUser?.firstName[0]}{currentUser?.lastName[0]}
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your achievements, projects, or thoughts..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPostType(type.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        postType === type.id
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};