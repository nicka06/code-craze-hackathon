'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '@/lib/api';
import { Post } from '@/lib/types';

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      const response = await getPosts(filter || undefined);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      approved: 'bg-[#5ce7ff]/10 text-[#5ce7ff] border-[#5ce7ff]/20',
      declined: 'bg-red-500/10 text-red-400 border-red-500/20',
      posted: 'bg-green-500/10 text-green-400 border-green-500/20',
      failed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 border-4 border-[#5ce7ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Post History</h1>
          <p className="text-gray-400">{posts.length} total posts</p>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:border-gray-700 transition text-sm font-medium"
        >
          <option value="">All Posts</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="posted">Posted</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-[#141414] border border-gray-800 p-12 rounded-xl text-center">
          <p className="text-gray-400">No posts found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#141414] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[#5ce7ff] font-semibold">
                      @{post.account?.instagram_username || 'N/A'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(post.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-3 line-clamp-2">{post.caption}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{post.email}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">{post.media.length} media file{post.media.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 text-gray-300 rounded-lg hover:bg-[#222] hover:border-gray-700 transition text-sm font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* View Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPost(null)}>
          <div className="bg-[#141414] border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Submission Details</h2>
                  <p className="text-gray-400">@{selectedPost.account?.instagram_username}</p>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Caption</h3>
                <p className="text-white whitespace-pre-wrap text-center">{selectedPost.caption}</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Contact</h3>
                <p className="text-white">{selectedPost.email}</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(selectedPost.status)}`}>
                  {selectedPost.status}
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Media ({selectedPost.media.length})</h3>
                <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                  {selectedPost.media.map((url, idx) => (
                    <div key={idx} className="aspect-square bg-[#0a0a0a] rounded-lg overflow-hidden w-48">
                      <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-3 bg-[#1a1a1a] border border-gray-800 text-gray-300 rounded-lg hover:bg-[#222] hover:border-gray-700 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

