interface PerformanceStats {
  fps: number;
  frameTime: number;
  droppedFrames: number;
}

class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private callback: ((stats: PerformanceStats) => void) | null = null;
  private rafId: number | null = null;
  private isRunning: boolean = false;

  start(callback: (stats: PerformanceStats) => void) {
    if (this.isRunning) {
      this.stop();
    }

    this.callback = callback;
    this.isRunning = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / elapsed);
      const frameTime = elapsed / this.frameCount;
      const expectedFrames = 60;
      const droppedFrames = Math.max(0, expectedFrames - fps);

      this.callback?.({
        fps,
        frameTime,
        droppedFrames
      });

      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };
}

export const performanceMonitor = new PerformanceMonitor();
export type { PerformanceStats };
