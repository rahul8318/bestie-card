import React, { useState, useRef, useEffect } from 'react';
import { VideoConfig, PRESET_THEMES } from './types';
import { VideoCanvas, VideoCanvasRef } from './components/VideoCanvas';
import { Controls } from './components/Controls';
import { synthesizer } from './utils/audio';
import { 
  Sparkles, Heart, Play, Pause, RotateCcw, Video, 
  Settings, HelpCircle, Laptop, Download, Globe, Volume2, X
} from 'lucide-react';

const DEFAULT_CONFIG: VideoConfig = {
  themeName: 'Bestie Forever (Original)',
  backgroundColor: '#050206',
  matrixColor: 'rgba(255, 30, 130, 0.45)',
  particleColor: '#ffffff',
  glowColor: 'rgba(255, 50, 150, 0.95)',
  heartColor: 'rgba(255, 20, 120, 1)',
  
  // Matrix rain parameters
  matrixDensity: 0.6,
  matrixSpeed: 1.5,
  matrixChars: 'bestie',
  matrixCharSize: 13,

  // Particle properties
  particleSize: 1.8,
  particleCount: 1300,
  glowStrength: 15,
  interactiveForce: 'repel',
  interactiveRadius: 85,
  heartPulseRate: 1.0,

  // Sequences
  slides: [
    { id: 's_1', text: '3', duration: 1.0 },
    { id: 's_2', text: '2', duration: 1.0 },
    { id: 's_3', text: '1', duration: 1.0 },
    { id: 's_4', text: 'You', duration: 1.8 },
    { id: 's_5', text: 'Are', duration: 1.8 },
    { id: 's_6', text: 'My', duration: 1.8 },
    { id: 's_7', text: 'Besty', duration: 1.8 },
    { id: 's_8', text: 'For', duration: 1.8 },
    { id: 's_9', text: 'Ever', duration: 2.4 },
  ],
  heartText: 'You Are My Besty ❤️',
  heartSubText: 'For Ever',
  useCursiveFont: false,

  enableSoundEffects: true,
  enableBackgroundMusic: true,
  enableHeartbeat: true,
};

export default function App() {
  const [config, setConfig] = useState<VideoConfig>(DEFAULT_CONFIG);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Default to false so envelope starts paused
  const [isRecording, setIsRecording] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUI, setShowUI] = useState(false);
  
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showClassicCard, setShowClassicCard] = useState(false);
  const cardShownRef = useRef(false);

  const canvasRef = useRef<VideoCanvasRef | null>(null);

  // Synchronize ambient background synthesizer melody with playback state
  useEffect(() => {
    if (envelopeOpened && isPlaying && config.enableBackgroundMusic) {
      synthesizer.startBackgroundMusic();
    } else {
      synthesizer.stopBackgroundMusic();
    }
    return () => {
      synthesizer.stopBackgroundMusic();
    };
  }, [envelopeOpened, isPlaying, config.enableBackgroundMusic]);

  // Playback handlers
  const handlePlay = () => {
    setIsPlaying(true);
    canvasRef.current?.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    canvasRef.current?.pause();
  };

  const handleRestart = () => {
    setIsPlaying(true);
    canvasRef.current?.restart();
  };

  const handleStartRecord = () => {
    setIsRecording(true);
    canvasRef.current?.startRecording();
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    canvasRef.current?.stopRecording();
  };

  // Skip timeline to slide
  const handleSeek = (index: number) => {
    setCurrentSlideIndex(index);
    canvasRef.current?.seekToSlide(index);
  };

  // Realtime Timeline Tracker
  const handleTimelineUpdate = (currentIdx: number, elapsed: number, totalDuration: number) => {
    setCurrentSlideIndex(currentIdx);
    const percentage = Math.min(100, (elapsed / totalDuration) * 100);
    setTimelineProgress(percentage);
  };

  // Change default sequence using preset message buttons
  const applyMessagePreset = (presetType: 'bestie' | 'anniversary' | 'classic' | 'retro' | 'bestieSong') => {
    let slides = [...DEFAULT_CONFIG.slides];
    let heartText = 'Bestie Forever ❤️';
    let heartSubText = 'Always & Forever';

    if (presetType === 'bestie') {
      slides = [
        { id: 'b_1', text: '3', duration: 1.2 },
        { id: 'b_2', text: '2', duration: 1.2 },
        { id: 'b_3', text: '1', duration: 1.2 },
        { id: 'b_4', text: 'I', duration: 1.8 },
        { id: 'b_5', text: 'Am', duration: 1.8 },
        { id: 'b_6', text: 'Her', duration: 1.8 },
        { id: 'b_7', text: 'Bestfriend', duration: 1.8 },
        { id: 'b_8', text: 'And', duration: 1.8 },
        { id: 'b_9', text: 'She', duration: 1.8 },
        { id: 'b_10', text: 'Is', duration: 1.8 },
        { id: 'b_11', text: 'My', duration: 1.8 },
        { id: 'b_12', text: 'Besty', duration: 2.4 },
      ];
      heartText = 'I Am Her Bestfriend';
      heartSubText = 'She Is My Besty';
    } else if (presetType === 'bestieSong') {
      slides = [
        { id: 'bs_1', text: 'Song Start', duration: 1.0 },
        { id: 'bs_2', text: 'Through', duration: 1.8 },
        { id: 'bs_3', text: 'Highs', duration: 1.8 },
        { id: 'bs_4', text: 'And', duration: 1.8 },
        { id: 'bs_5', text: 'Lows', duration: 1.8 },
        { id: 'bs_6', text: 'You', duration: 1.8 },
        { id: 'bs_7', text: 'Are', duration: 1.8 },
        { id: 'bs_8', text: 'My', duration: 1.8 },
        { id: 'bs_9', text: 'Ride', duration: 1.8 },
        { id: 'bs_10', text: 'Or', duration: 1.8 },
        { id: 'bs_11', text: 'Die', duration: 1.8 },
        { id: 'bs_12', text: 'Bestie', duration: 2.4 },
      ];
      heartText = 'I Am Her Bestfriend';
      heartSubText = 'She Is My Besty';
    } else if (presetType === 'anniversary') {
      slides = [
        { id: 'a_1', text: '3', duration: 1.2 },
        { id: 'a_2', text: '2', duration: 1.2 },
        { id: 'a_3', text: '1', duration: 1.2 },
        { id: 'a_4', text: 'Another', duration: 1.8 },
        { id: 'a_5', text: 'Beautiful', duration: 1.8 },
        { id: 'a_6', text: 'Year', duration: 1.8 },
        { id: 'a_7', text: 'Together', duration: 2.4 },
      ];
      heartText = 'Happy Anniversary! 🎉';
      heartSubText = 'To the absolute friendship of my life';
    } else if (presetType === 'retro') {
      slides = [
        { id: 'r_1', text: 'INIT', duration: 1.2 },
        { id: 'r_2', text: 'LOAD_BESTIE', duration: 1.2 },
        { id: 'r_3', text: 'RUN_MAIN', duration: 1.2 },
        { id: 'r_4', text: 'while(true)', duration: 1.8 },
        { id: 'r_5', text: '{\n  bestie(You);\n}', duration: 2.2 },
      ];
      heartText = 'SYSTEM_SECURE_HEART';
      heartSubText = 'Status: Infinite Loops of Friendship';
    }

    setConfig({
      ...config,
      slides,
      heartText,
      heartSubText,
    });

    setTimeout(() => {
      canvasRef.current?.restart();
    }, 50);
  };

  const handleOpenEnvelope = () => {
    setIsOpening(true);
    if (config.enableSoundEffects) {
      synthesizer.playSparkle();
    }
    setTimeout(() => {
      setEnvelopeOpened(true);
      setIsPlaying(true);
      canvasRef.current?.play();
    }, 1200);
  };

  const handleCloseClassicCard = () => {
    setShowClassicCard(false);
    setTimeout(() => {
      canvasRef.current?.restart();
      setIsPlaying(true);
    }, 300);
  };

  return (
    <div className="min-h-screen w-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-rose-500/30 selection:text-white relative overflow-hidden">
      
      {/* 100% Pure Full Screen Video Stage */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-black select-none">
        <VideoCanvas
          ref={canvasRef}
          config={config}
          isFullscreen={true}
          onTimelineUpdate={handleTimelineUpdate}
          onPlaybackComplete={() => {
            if (!cardShownRef.current) {
              cardShownRef.current = true;
              setShowClassicCard(true);
            }
          }}
        />
      </div>

      {/* 💌 Interactive Friendship Letter Envelope Opening Intro */}
      {!envelopeOpened && (
        <div 
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-[#0f040d] to-[#050206] transition-all duration-1000 ${
            isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* Decorative glowing particles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Floating Message */}
          <div className="text-center mb-10 z-10 px-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-rose-500 uppercase font-bold block mb-3 animate-pulse">
              💖 A SURPRISE FOR MY BESTIE 💖
            </span>
            <h1 className="text-2xl md:text-3xl font-serif italic text-white font-medium tracking-wide">
              You have received a magical friendship letter...
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-2 tracking-wider">
              Tap the wax seal below to unlock the magic inside
            </p>
          </div>

          {/* Envelope Card */}
          <div 
            onClick={handleOpenEnvelope}
            className={`relative w-80 h-52 bg-[#140b17] border border-white/10 rounded-2xl shadow-[0_25px_60px_-15px_rgba(244,63,94,0.25)] flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-105 hover:border-rose-500/40 group ${
              isOpening ? 'translate-y-[-100px] opacity-0 rotate-12 scale-90' : ''
            }`}
          >
            {/* Triangular Top Flap Accent */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#1c1021] to-[#140b17] rounded-t-2xl border-b border-white/5 pointer-events-none group-hover:from-[#25152c]" 
                 style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }} />

            {/* Glowing Aura inside */}
            <div className="absolute w-36 h-36 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/20 transition-all duration-500" />

            {/* Glowing Red Wax Seal Pulsing Heart */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-700 to-red-500 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.6)] border border-rose-400/30 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-rose-400 uppercase font-bold mt-4 group-hover:text-rose-300">
                TAP TO OPEN
              </span>
            </div>

            {/* Ribbon accents */}
            <div className="absolute left-0 bottom-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-b-2xl opacity-60" />
          </div>

          <p className="text-[10px] font-mono text-neutral-600 mt-12 tracking-widest uppercase">
            Designed with absolute friendship • your bestfriend rahul
          </p>
        </div>
      )}

      {/* Classic Best Friend Card Overlay */}
      {showClassicCard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 md:p-8">
          <div className="relative max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-[#f4e4bc] rounded-sm shadow-2xl border-2 sm:border-4 border-[#8b4513]/80" style={{ fontFamily: '"Cormorant Garamond", "Times New Roman", serif' }}>
            
            {/* Victorian ornamental border */}
            <div className="absolute inset-1 sm:inset-2 border border-[#8b4513]/30 pointer-events-none rounded-sm" />
            <div className="absolute inset-3 sm:inset-4 border border-[#8b4513]/20 pointer-events-none rounded-sm" />
            
            {/* Corner flourishes */}
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-[#8b4513]/60" />
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-[#8b4513]/60" />
            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-[#8b4513]/60" />
            <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-[#8b4513]/60" />

            <div className="relative p-5 sm:p-8 md:p-12">
              {/* Header ornament */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#8b4513]/60" />
                  <span className="text-xl sm:text-2xl text-[#8b4513]">❦</span>
                  <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#8b4513]/60" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5c3317] tracking-wide mb-2" style={{ fontFamily: '"Cormorant Garamond", "Times New Roman", serif' }}>
                  Happy Best Friend's Day!
                </h2>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#8b4513]/60" />
                  <span className="text-xl sm:text-2xl text-[#8b4513]">❤️</span>
                  <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#8b4513]/60" />
                </div>
              </div>

              {/* Message body */}
              <div className="text-center space-y-4 sm:space-y-6 text-[#5c3317] text-sm sm:text-base md:text-lg leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", "Times New Roman", serif', lineHeight: '1.8' }}>
                <p className="italic">
                  Dearest Best Friend,
                </p>
                
                <p>
                  I just wanted to remind you how grateful I am to have you in my life. 
                  Thank you for always being there through my happiest moments and my toughest days. 
                  Your support, laughter, and endless patience mean more to me than words can express.
                </p>

                <p>
                  Life is so much brighter because you're a part of it. No matter where life takes us, 
                  I hope we always stay as close as we are today. Thank you for being my safe place, 
                  my biggest cheerleader, and the person who makes even ordinary days unforgettable.
                </p>

                <p>
                  You truly are one of the best gifts life has given me. I wish you endless happiness, 
                  success, and all the love you deserve.
                </p>

                <div className="pt-4 sm:pt-6 pb-2">
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <div className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent to-[#8b4513]/50" />
                    <span className="text-xl sm:text-2xl">💖🌸</span>
                    <div className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent to-[#8b4513]/50" />
                  </div>
                  <p className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-[#5c3317] italic">
                    Happy Best Friend's Day! Love you always.
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-[#8b4513]/80 tracking-widest uppercase">
                    Forever Your Best Friend
                  </p>
                </div>
              </div>

              {/* Close button */}
              <div className="mt-8 sm:mt-10 text-center">
                <button
                  onClick={handleCloseClassicCard}
                  className="px-5 sm:px-6 py-2 bg-[#8b4513]/90 text-[#f4e4bc] rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#5c3317] transition-colors duration-300 shadow-lg"
                  style={{ fontFamily: '"Cormorant Garamond", "Times New Roman", serif' }}
                >
                  Close Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
