import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CareerPrediction } from '@/data/quizData';
import { Button } from './Button';
import { RefreshCw, Home } from 'lucide-react';

interface WorldBuildingProps {
  prediction: CareerPrediction;
  onRestart: () => void;
}

const characterVideos: Record<string, string> = {
  scientist: '/videos/doraemon-wave.mp4',
  engineer: '/videos/phineas-ferb-wave.mp4',
  tech_hero: '/videos/hiro-wave.mp4',
  artist: '/videos/rapunzel-wave.mp4',
  doctor: '/videos/baymax-wave.mp4',
  sportsperson: '/videos/goku-wave.mp4',
  environment_hero: '/videos/moana-wave.mp4',
};

const worldThemes: Record<string, { bg: string; accent: string; particles: string[] }> = {
  scientist: { 
    bg: 'from-blue-900 via-purple-900 to-indigo-950', 
    accent: 'text-cyan-400',
    particles: ['🔬', '⚗️', '🧬', '🔭', '💡', '⚛️']
  },
  engineer: { 
    bg: 'from-orange-900 via-amber-800 to-yellow-900', 
    accent: 'text-orange-400',
    particles: ['⚙️', '🔧', '🔩', '🛠️', '📐', '🏗️']
  },
  tech_hero: { 
    bg: 'from-violet-900 via-fuchsia-900 to-purple-950', 
    accent: 'text-fuchsia-400',
    particles: ['🤖', '💻', '🎮', '🚀', '🌐', '📱']
  },
  artist: { 
    bg: 'from-pink-900 via-rose-800 to-purple-900', 
    accent: 'text-pink-400',
    particles: ['🎨', '🖌️', '✨', '🌈', '🎭', '🎪']
  },
  doctor: { 
    bg: 'from-emerald-900 via-teal-800 to-cyan-900', 
    accent: 'text-emerald-400',
    particles: ['💊', '🏥', '❤️', '🩺', '💉', '🧪']
  },
  sportsperson: { 
    bg: 'from-red-900 via-orange-800 to-yellow-900', 
    accent: 'text-yellow-400',
    particles: ['⚽', '🏀', '🏆', '💪', '🥇', '⚡']
  },
  environment_hero: { 
    bg: 'from-green-900 via-emerald-800 to-teal-900', 
    accent: 'text-green-400',
    particles: ['🌊', '🌿', '🌍', '🌸', '🦋', '🐬']
  },
};

export function WorldBuilding({ prediction, onRestart }: WorldBuildingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWorld, setShowWorld] = useState(false);
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  
  const theme = worldThemes[prediction.type] || worldThemes.scientist;
  const videoUrl = characterVideos[prediction.type];

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: theme.particles[Math.floor(Math.random() * theme.particles.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);

    // Intro animation
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Show world after video plays
    const timer = setTimeout(() => {
      setShowWorld(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [theme.particles]);

  useEffect(() => {
    if (showWorld && containerRef.current) {
      gsap.fromTo(
        '.world-content',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }
  }, [showWorld]);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}
    >
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-4xl animate-float pointer-events-none opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Character Video */}
      {!showWorld && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="max-w-md w-full rounded-3xl shadow-2xl"
              onEnded={() => setShowWorld(true)}
            >
              <source src={videoUrl} type="video/mp4" />
              {/* Fallback for missing video */}
            </video>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className={`font-fredoka text-xl ${theme.accent}`}>
                Hi there, future {prediction.title}! 👋
              </p>
            </div>
          </div>
        </div>
      )}

      {/* World Building Content */}
      {showWorld && (
        <div className="world-content absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            <h1 className={`font-fredoka text-4xl md:text-6xl font-bold ${theme.accent} mb-6`}>
              Welcome to Your World! 🌟
            </h1>
            
            <div className="bg-card/20 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-8">
              <div className="text-8xl mb-6">{prediction.emoji}</div>
              <h2 className="font-fredoka text-3xl text-white mb-4">
                Future {prediction.title}'s Universe
              </h2>
              <p className="font-nunito text-xl text-white/80 mb-6">
                {prediction.description}
              </p>
              <p className="font-nunito text-white/60">
                Just like <strong className={theme.accent}>{prediction.character}</strong>!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={onRestart}>
                <RefreshCw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/'}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
