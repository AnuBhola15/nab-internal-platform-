import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Award, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post, User } from '../../types';
import { database } from '../../utils/database';
import { useAuth } from '../../context/AuthContext';

interface PostCardProps {
  post: Post;
  author: User;
  onUpdate: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, author, onUpdate }) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!currentUser) return;
    
    const isLiked = post.likes.includes(currentUser.id);
    const updatedLikes = isLiked
      ? post.likes.filter(id => id !== currentUser.id)
      : [...post.likes, currentUser.id];
    
    database.updatePost(post.id, { likes: updatedLikes });
    onUpdate();
  };

  const handleComment = () => {
    if (!currentUser || !comment.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: comment.trim(),
      timestamp: new Date().toISOString(),
      likes: []
    };

    database.updatePost(post.id, { 
      comments: [...post.comments, newComment] 
    });
    setComment('');
    onUpdate();
  };

  const getPostIcon = () => {
    switch (post.type) {
      case 'certification':
        return <Award className="h-5 w-5 text-yellow-600" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-green-600" />;
      case 'project':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {author.firstName[0]}{author.lastName[0]}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900">
              {author.firstName} {author.lastName}
            </h3>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{author.position}</span>
            {getPostIcon()}
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  post.likes.includes(currentUser?.id || '')
                    ? 'text-red-600'
                    : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm">{post.likes.length}</span>
              </button>
              
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{post.comments.length}</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
                <Share2 className="h-5 w-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
          
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="space-y-3 mb-4">
                {post.comments.map((comment) => {
                  const commentAuthor = database.getUserById(comment.userId);
                  return (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {commentAuthor?.firstName[0]}{commentAuthor?.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gray-900">
                            {commentAuthor?.firstName} {commentAuthor?.lastName}
                          </p>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser?.firstName[0]}{currentUser?.lastName[0]}
                  </span>
                </div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleComment();
                  }}
                />
                <button
                  onClick={handleComment}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};