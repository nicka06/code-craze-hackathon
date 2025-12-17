'use client';

import { useState, useEffect } from 'react';
import { getPosts, approvePost, declinePost } from '@/lib/api';
import { Post } from '@/lib/types';

export default function PendingPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [declineId, setDeclineId] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await getPosts('pending');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approvePost(id);
      loadPosts();
      setSelectedPost(null);
    } catch (error) {
      alert('Failed to approve: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineId || !declineReason.trim()) return;
    
    try {
      await declinePost(declineId, declineReason);
      setDeclineId(null);
      setDeclineReason('');
      setSelectedPost(null);
      loadPosts();
    } catch (error) {
      alert('Failed to decline: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pending Submissions</h1>
        <p className="text-gray-400">{posts.length} awaiting review</p>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-[#141414] border border-gray-800 p-12 rounded-xl text-center">
          <p className="text-gray-400">No pending submissions</p>
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
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="px-4 py-2 bg-[#5ce7ff]/10 text-[#5ce7ff] border border-[#5ce7ff]/20 rounded-lg hover:bg-[#5ce7ff]/20 transition text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setDeclineId(post.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition text-sm font-medium"
                  >
                    Decline
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
                <h3 className="text-sm font-medium text-gray-400 mb-4">Media ({selectedPost.media.length})</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {selectedPost.media.map((url, idx) => (
                    <div key={idx} className="aspect-square bg-[#0a0a0a] rounded-lg overflow-hidden">
                      <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 max-w-md mx-auto">
                <button
                  onClick={() => handleApprove(selectedPost.id)}
                  className="flex-1 px-6 py-3 bg-[#5ce7ff] text-black rounded-lg hover:bg-[#4dd4ee] transition font-semibold"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setDeclineId(selectedPost.id);
                    setSelectedPost(null);
                  }}
                  className="flex-1 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition font-semibold"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Decline Modal */}
      {declineId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Decline Submission</h2>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-[#5ce7ff] focus:ring-1 focus:ring-[#5ce7ff] outline-none mb-4"
              placeholder="Enter reason for declining..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeclineSubmit}
                disabled={!declineReason.trim()}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-600 transition font-semibold"
              >
                Confirm Decline
              </button>
              <button
                onClick={() => {
                  setDeclineId(null);
                  setDeclineReason('');
                }}
                className="flex-1 bg-[#1a1a1a] border border-gray-800 text-gray-300 py-3 rounded-lg hover:bg-[#222] hover:border-gray-700 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

