import { useState, useEffect, useCallback } from 'react';
import { performanceMonitor } from '../lib/performanceMonitor';

type QualityLevel = 'high' | 'medium' | 'low';

export interface LoadingConfig {
  particleCount: number;
  lightBeamCount: number;
  starCount: number;
  dpr: [number, number];
  enableGlow: boolean;
  enableRings: boolean;
  rotationSpeed: number;
  particleSize: number;
}

const configs: Record<QualityLevel, LoadingConfig> = {
  high: {
    particleCount: 3500,
    lightBeamCount: 55,
    starCount: 4000,
    dpr: [1, 1.5],
    enableGlow: true,
    enableRings: true,
    rotationSpeed: 0.02,
    particleSize: 0.05,
  },
  medium: {
    particleCount: 1500,
    lightBeamCount: 25,
    starCount: 2000,
    dpr: [1, 1.5],
    enableGlow: true,
    enableRings: true,
    rotationSpeed: 0.015,
    particleSize: 0.06,
  },
  low: {
    particleCount: 800,
    lightBeamCount: 15,
    starCount: 1000,
    dpr: [1, 1],
    enableGlow: false,
    enableRings: false,
    rotationSpeed: 0.01,
    particleSize: 0.08,
  }
};

export const useDynamicLoadingConfig = () => {
  const [quality, setQuality] = useState<QualityLevel>('medium');
  const [config, setConfig] = useState<LoadingConfig>(configs.medium);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Initial device detection
  useEffect(() => {
    const detectInitialQuality = (): QualityLevel => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const cpuCores = navigator.hardwareConcurrency || 4;
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // High-end mobile detection (iPhone 15 Pro, Galaxy S24, etc.)
      const isHighEndMobile = isMobile && (
        (cpuCores >= 6 && deviceMemory >= 6) ||
        /iPhone.*Pro/.test(navigator.userAgent) ||
        /Samsung.*S2[0-9]/.test(navigator.userAgent)
      );

      if (prefersReducedMotion) {
        return 'low';
      } else if (!isMobile || isHighEndMobile) {
        if (cpuCores >= 8 && deviceMemory >= 8) return 'high';
        if (cpuCores >= 4 && deviceMemory >= 4) return 'medium';
      }

      return isMobile ? 'low' : 'medium';
    };

    const initialQuality = detectInitialQuality();
    setQuality(initialQuality);
    setConfig(configs[initialQuality]);
  }, []);

  // Update config when quality changes
  useEffect(() => {
    setConfig(configs[quality]);
  }, [quality]);

  // Dynamic FPS monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    let lowFpsCount = 0;
    let checkTimeout: NodeJS.Timeout;

    const startMonitoring = () => {
      performanceMonitor.start((stats) => {
        // If FPS drops below 30 for 3 consecutive seconds, reduce quality
        if (stats.fps < 30) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            setQuality((prev) => {
              if (prev === 'high') {
                console.log('[LoadingScreen] FPS dropped, reducing to medium quality');
                return 'medium';
              }
              if (prev === 'medium') {
                console.log('[LoadingScreen] FPS dropped, reducing to low quality');
                return 'low';
              }
              return prev;
            });
            lowFpsCount = 0;
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1);
        }
      });

      // Stop monitoring after 10 seconds
      checkTimeout = setTimeout(() => {
        performanceMonitor.stop();
        setIsMonitoring(false);
        console.log('[LoadingScreen] Performance monitoring complete');
      }, 10000);
    };

    // Start monitoring after 500ms (let initial render complete)
    const timeout = setTimeout(startMonitoring, 500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(checkTimeout);
      performanceMonitor.stop();
    };
  }, [isMonitoring]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  return { config, quality, startMonitoring };
};
