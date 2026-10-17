import React, { useEffect } from 'react';

export const ClickRippleManager: React.FC = () => {
  useEffect(() => {
    // Avoid animation overhead if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      // Find if clicked element is interactive (button, a, input, etc.) or just any user tap
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const ripple = document.createElement('div');
      ripple.className = 'click-ripple-particle';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;

      document.body.appendChild(ripple);

      // Clean up DOM node after animation completes
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 460);
    };

    window.addEventListener('pointerdown', handleClick, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleClick);
    };
  }, []);

  return null;
};
