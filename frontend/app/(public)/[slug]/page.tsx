'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitPost } from '@/lib/api';

export default function UploadPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [email, setEmail] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('account_id', '1'); // Hardcoded for now
      formData.append('caption', caption);
      formData.append('email', email);
      if (instagramUsername) formData.append('instagram_username', instagramUsername);
      
      files.forEach((file) => {
        formData.append('media', file);
      });

      await submitPost(formData);
      alert('Submission successful! Check your email for confirmation.');
      router.push('/accounts');
    } catch (error) {
      alert('Submission failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Submit Content to @{params.slug}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Media (1-10 files)</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {files.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">{files.length} file(s) selected</p>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2">Caption *</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Write your caption..."
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
            />
          </div>

          {/* Instagram Username */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Instagram (Optional)</label>
            <input
              type="text"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="@your_instagram"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Submitting...' : 'Submit Content'}
          </button>
        </form>
      </div>
    </div>
  );
}

