'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { submitPost } from '@/lib/api';

export default function TattleNewsUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [showAspectMenu, setShowAspectMenu] = useState(false);
  const [caption, setCaption] = useState('');
  const [email, setEmail] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(acceptedFiles);
    setCurrentImageIndex(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov']
    },
    maxFiles: 10
  });

  const handleAspectRatio = (ratio: number) => {
    setAspect(ratio);
    setShowAspectMenu(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('account_id', '1');
      formData.append('caption', caption);
      formData.append('email', email);
      if (instagramUsername) formData.append('instagram_username', instagramUsername);
      
      images.forEach((file) => {
        formData.append('media', file);
      });

      await submitPost(formData);
      setLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      alert('Submission failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link 
            href="/accounts" 
            className="flex items-center gap-2 text-gray-400 hover:text-[#5ce7ff] transition group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold bg-linear-to-r from-[#5ce7ff] to-[#ff1fa9] bg-clip-text text-transparent">Tattle News</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area - Only show if no images */}
          {images.length === 0 && (
            <div className="bg-[#111111] border border-gray-800 p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4">Upload Your Media</h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition ${
                  isDragActive
                    ? 'border-[#5ce7ff] bg-[#5ce7ff]/5'
                    : 'border-gray-700 hover:border-[#5ce7ff]/50 hover:bg-gray-900'
                }`}
              >
                <input {...getInputProps()} />
                <div>
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-xl mb-2">Drop your images or videos here</p>
                  <p className="text-sm text-gray-400">or click to browse • Up to 10 files</p>
                  <p className="text-xs text-gray-500 mt-2">JPEG, PNG, MP4, MOV supported</p>
                </div>
              </div>
            </div>
          )}

          {/* Image Cropper */}
          {images.length > 0 && (
            <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Edit Media ({currentImageIndex + 1}/{images.length})
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setImages([]);
                    setCurrentImageIndex(0);
                  }}
                  className="text-sm text-white/60 hover:text-white transition"
                >
                  Change Files
                </button>
              </div>

              <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden border border-gray-800">
                <Cropper
                  image={URL.createObjectURL(images[currentImageIndex])}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                />
                
                {/* Previous Button */}
                {currentImageIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition backdrop-blur-sm border border-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Next Button */}
                {currentImageIndex < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition backdrop-blur-sm border border-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                
                {/* Aspect Ratio Button */}
                <button
                  type="button"
                  onClick={() => setShowAspectMenu(!showAspectMenu)}
                  className="absolute bottom-4 right-4 bg-white/95 hover:bg-white p-3 rounded-full transition shadow-xl backdrop-blur-sm border border-black/10"
                  title="Change aspect ratio"
                >
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>

                {/* Aspect Ratio Menu */}
                {showAspectMenu && (
                  <div className="absolute bottom-20 right-4 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl p-2 space-y-1 backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => handleAspectRatio(1)}
                      className="block w-full px-6 py-3 text-left hover:bg-gray-800 rounded-lg transition font-medium text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/40 rounded"></div>
                        <span>Square (1:1)</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAspectRatio(4 / 5)}
                      className="block w-full px-6 py-3 text-left hover:bg-gray-800 rounded-lg transition font-medium text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-6 border-2 border-white/40 rounded"></div>
                        <span>Portrait (4:5)</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAspectRatio(1.91)}
                      className="block w-full px-6 py-3 text-left hover:bg-gray-800 rounded-lg transition font-medium text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-5 border-2 border-white/40 rounded"></div>
                        <span>Landscape (1.91:1)</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl">
            <label className="block text-lg font-semibold mb-3">Caption *</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5ce7ff] focus:border-transparent text-white placeholder-gray-500"
              placeholder="Tell us your story..."
            />
          </div>

          {/* Email */}
          <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl">
            <label className="block text-lg font-semibold mb-3">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5ce7ff] focus:border-transparent text-white placeholder-gray-500"
              placeholder="your@email.com"
            />
          </div>

          {/* Instagram Username */}
          <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl">
            <label className="block text-lg font-semibold mb-3">Your Instagram (Optional)</label>
            <input
              type="text"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5ce7ff] focus:border-transparent text-white placeholder-gray-500"
              placeholder="@your_instagram"
            />
            <p className="text-sm text-white/40 mt-2">We'll credit you in the post if approved</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || images.length === 0}
            className="w-full bg-linear-to-r from-[#5ce7ff] to-[#ff1fa9] text-white py-4 rounded-full text-lg font-bold hover:shadow-[0_0_40px_rgba(92,231,255,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Submitting...' : 'Submit to Tattle News'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Submission Successful!</h2>
              <p className="text-gray-400">
                Your content has been submitted. Check your email for confirmation.
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/accounts');
              }}
              className="w-full bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] text-black py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#5ce7ff]/30 transition-all"
            >
              Back to Accounts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

