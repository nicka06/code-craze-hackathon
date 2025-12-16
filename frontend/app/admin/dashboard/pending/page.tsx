'use client';

import { useState, useEffect } from 'react';
import { getPosts, approvePost, declinePost } from '@/lib/api';
import { Post } from '@/lib/types';

export default function PendingPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!confirm('Approve this post?')) return;
    
    try {
      await approvePost(id);
      loadPosts(); // Reload
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
      loadPosts(); // Reload
    } catch (error) {
      alert('Failed to decline: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Posts ({posts.length})</h1>
      
      {posts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No pending posts
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Caption</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Media</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {post.account?.instagram_username || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm">{post.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {post.caption.substring(0, 50)}...
                  </td>
                  <td className="px-6 py-4 text-sm">{post.media.length} file(s)</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setDeclineId(post.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Decline Modal */}
      {declineId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Decline Post</h2>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Reason for declining..."
            />
            <div className="flex space-x-2">
              <button
                onClick={handleDeclineSubmit}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setDeclineId(null);
                  setDeclineReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
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

