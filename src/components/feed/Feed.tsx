import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { database } from '../../utils/database';
import { Post, User } from '../../types';

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = () => {
    setPosts(database.getPosts());
    setUsers(database.getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreatePost onPostCreated={loadData} />
      
      <div className="space-y-6">
        {posts.map((post) => {
          const author = users.find(u => u.id === post.userId);
          if (!author) return null;
          
          return (
            <PostCard
              key={post.id}
              post={post}
              author={author}
              onUpdate={loadData}
            />
          );
        })}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};