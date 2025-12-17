'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    // Create floating particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#5ce7ff' : '#ff1fa9',
      });
    }

    function animate() {
      if (!canvas || !ctx) return;
      
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = 0.2 * (1 - distance / 150);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse follower effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animateCursor = () => {
      // Main cursor follows immediately
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mousePos.current.x}px`;
        cursorRef.current.style.top = `${mousePos.current.y}px`;
      }

      // Smooth trail effect with easing
      if (cursorTrailRef.current) {
        trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.15;
        trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.15;
        cursorTrailRef.current.style.left = `${trailPos.current.x}px`;
        cursorTrailRef.current.style.top = `${trailPos.current.y}px`;
      }

      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animateCursor();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5ce7ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#ff1fa9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#5ce7ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Mouse Follower - Trail (larger, more visible) */}
      <div
        ref={cursorTrailRef}
        className="fixed w-20 h-20 pointer-events-none"
        style={{
          zIndex: 50,
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] rounded-full blur-2xl opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] rounded-full opacity-30"></div>
      </div>

      {/* Mouse Follower - Main Cursor (smaller, precise) */}
      <div
        ref={cursorRef}
        className="fixed w-4 h-4 pointer-events-none"
        style={{
          zIndex: 60,
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
        }}
      >
        <div className="absolute inset-0 bg-white rounded-full shadow-lg shadow-[#5ce7ff]/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] rounded-full opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-xl font-semibold bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] bg-clip-text text-transparent">
            Open Source News
          </div>
          <Link
            href="/accounts"
            className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium hover:bg-white/20 transition border border-white/20 hover:border-white/40"
          >
            Book-A-Post
          </Link>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl relative">
            {/* Floating geometric shapes */}
            <div className="absolute -top-20 -left-20 w-40 h-40 border-2 border-[#5ce7ff]/30 rounded-lg rotate-45 animate-float"></div>
            <div className="absolute -bottom-20 -right-20 w-32 h-32 border-2 border-[#ff1fa9]/30 rounded-full animate-float-delayed"></div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-[#5ce7ff] via-white to-[#ff1fa9] bg-clip-text text-transparent animate-gradient">
                Community-Powered
              </span>
              <br />
              <span className="text-white">Content</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Submit your stories and perspectives to be featured on our Instagram accounts.
            </p>
            <Link
              href="/accounts"
              className="inline-block relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] text-black px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl">
                Get Started
              </div>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-6 border-t border-white/10 text-center text-sm text-gray-400">
          © 2024 Open Source News
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-20px) rotate(45deg);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(20px);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

