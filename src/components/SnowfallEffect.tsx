import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Snowflake, Leaf, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type EffectMode = 'snow' | 'leaves' | 'off';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  swayOffset: number;
  swaySpeed: number;
  colorIndex: number;
}

const SNOW_COLORS_DARK = [
  'rgba(255, 255, 255, ',
  'rgba(235, 245, 255, ',
  'rgba(215, 230, 255, ',
];

const SNOW_COLORS_LIGHT = [
  'rgba(110, 130, 160, ',
  'rgba(90, 115, 145, ',
  'rgba(140, 160, 185, ',
];

const LEAF_COLORS_DARK = [
  'rgba(224, 130, 58, ',   // amber
  'rgba(196, 75, 43, ',    // rust/crimson
  'rgba(212, 163, 89, ',   // golden ochre
  'rgba(168, 92, 50, ',    // deep copper
];

const LEAF_COLORS_LIGHT = [
  'rgba(180, 85, 30, ',    // warm terracotta
  'rgba(160, 55, 35, ',    // muted burgundy
  'rgba(185, 125, 45, ',   // olive-gold
  'rgba(140, 70, 30, ',    // russet
];

const PARTICLE_COUNT = 45;

export const SnowfallEffect: React.FC = () => {
  const [mode, setMode] = useState<EffectMode>('snow');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  // Detect dark/light mode
  useEffect(() => {
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setMode('off');
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMode('off');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Track cursor for gentle particle reaction
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const initParticles = useCallback((width: number, height: number, currentMode: EffectMode) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isSnow = currentMode === 'snow';
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSnow ? Math.random() * 2.8 + 1.2 : Math.random() * 6 + 5,
        speedY: isSnow ? Math.random() * 0.8 + 0.4 : Math.random() * 1.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: isSnow ? Math.random() * 0.45 + 0.25 : Math.random() * 0.5 + 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.008,
        colorIndex: Math.floor(Math.random() * 4),
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    if (mode === 'off') {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    initParticles(width, height, mode);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles(width, height, mode);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      const isSnow = mode === 'snow';
      const colorPalettes = isSnow
        ? isDarkMode
          ? SNOW_COLORS_DARK
          : SNOW_COLORS_LIGHT
        : isDarkMode
        ? LEAF_COLORS_DARK
        : LEAF_COLORS_LIGHT;

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Sway calculations
        p.swayOffset += p.swaySpeed;
        const sway = Math.sin(p.swayOffset) * (isSnow ? 0.7 : 1.4);

        // Subtle mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let pushX = 0;
        let pushY = 0;
        if (dist < 90 && dist > 0) {
          const force = (90 - dist) / 90;
          pushX = (dx / dist) * force * 1.5;
          pushY = (dy / dist) * force * 1.5;
        }

        p.x += p.speedX + sway + pushX;
        p.y += p.speedY + pushY;
        p.rotation += p.rotationSpeed;

        // Wrap around boundaries
        if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -10;
        if (p.x < -20) p.x = width + 10;

        const baseColor = colorPalettes[p.colorIndex % colorPalettes.length];
        ctx.fillStyle = `${baseColor}${p.opacity})`;

        if (isSnow) {
          // Soft snowflake circles with slight glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Delicate tumbling autumn / winter leaf shape
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation + Math.sin(p.swayOffset) * 0.3);

          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();

          // Subtle leaf vein
          ctx.strokeStyle = `${baseColor}${Math.max(0.1, p.opacity - 0.2)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.8, 0);
          ctx.lineTo(p.size * 0.8, 0);
          ctx.stroke();

          ctx.restore();
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [mode, isDarkMode, initParticles, handleMouseMove]);

  const cycleMode = () => {
    setMode((prev) => {
      if (prev === 'snow') return 'leaves';
      if (prev === 'leaves') return 'off';
      return 'snow';
    });
  };

  return (
    <>
      {/* Background Canvas: purely ambient and pointer-events-none */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[15] h-full w-full"
      />

      {/* Seasonal Control Badge (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-1.5">
        <button
          type="button"
          onClick={cycleMode}
          onMouseEnter={() => setIsControlsVisible(true)}
          onMouseLeave={() => setIsControlsVisible(false)}
          className={cn(
            'group flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface/90 px-2.5 font-mono text-[11px] text-secondary shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary hover:bg-elevated hover:text-primary',
            mode === 'off' && 'opacity-60 hover:opacity-100'
          )}
          title={`Seasonal ambient effect: currently ${mode}. Click to cycle.`}
          aria-label={`Seasonal ambient effect: currently ${mode}. Click to change.`}
        >
          {mode === 'snow' && <Snowflake size={13} className="text-primary animate-spin-slow" />}
          {mode === 'leaves' && <Leaf size={13} className="text-warning" />}
          {mode === 'off' && <EyeOff size={13} />}

          <span className="capitalize">{mode === 'off' ? 'Fx Off' : mode}</span>
        </button>

        {isControlsVisible && (
          <span className="hidden sm:inline-block rounded border border-line bg-surface px-2 py-0.5 font-mono text-[10px] text-tertiary">
            Click to switch ❄️ / 🍂 / off
          </span>
        )}
      </div>
    </>
  );
};

export default SnowfallEffect;
