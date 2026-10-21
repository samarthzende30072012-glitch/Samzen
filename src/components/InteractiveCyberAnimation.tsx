import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export const InteractiveCyberAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const colors = ['#3da9fc', '#59e3ff', '#90e0ef', '#ffffff'];

    const updateSize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const newWidth = parent?.clientWidth || window.innerWidth;
      const newHeight = parent?.clientHeight || window.innerHeight;

      // Only update if dimensions actually changed
      if (width !== newWidth || height !== newHeight) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      // Conservative particle count for stable 60fps on mobile
      const count = Math.min(24, Math.max(12, Math.floor((width * height) / 30000)));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.45 + 0.25,
        });
      }
    };

    updateSize();

    // IntersectionObserver: automatically pause animation when Hero scrolls offscreen
    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isIntersecting = entry.isIntersecting;
          isVisibleRef.current = isIntersecting;

          if (isIntersecting) {
            // Resume loop if not running
            if (!animFrameId.current) {
              animFrameId.current = requestAnimationFrame(render);
            }
          } else {
            // Cancel loop to save 100% GPU/CPU while scrolled down
            if (animFrameId.current) {
              cancelAnimationFrame(animFrameId.current);
              animFrameId.current = null;
            }
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    // Debounced resize handler
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateSize();
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse gently on desktop only (no touch listening to avoid scroll interference)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation render loop
    const render = () => {
      if (!isVisibleRef.current) {
        animFrameId.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const pLen = particles.length;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Mouse attraction if cursor is near (desktop only)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400 && distSq > 0) { // 120px radius squared
            const dist = Math.sqrt(distSq);
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 0.6;
            p.y += (dy / dist) * force * 0.6;
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 10000) { // 100px squared
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 100) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#59e3ff';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (observer && canvas) observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-60"
      aria-hidden="true"
    />
  );
};
