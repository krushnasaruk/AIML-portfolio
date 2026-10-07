import { useEffect, useRef, useState } from 'react';

export const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const cursor = cursorRef.current;
    const labelEl = labelRef.current;
    if (!cursor || !labelEl) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let rafId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onSetCursor = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newLabel = customEvent.detail || '';
      setLabel(newLabel);

      if (newLabel) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(2.8)`;
        cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        labelEl.style.opacity = '1';
      } else {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(1)`;
        cursor.style.backgroundColor = 'white';
        labelEl.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('setCursor', onSetCursor);

    // Fast, responsive Lerp loop (lerp factor 0.4 for zero perceptible lag)
    const render = () => {
      cursorX += (mouseX - cursorX) * 0.42;
      cursorY += (mouseY - cursorY) * 0.42;

      cursor.style.left = '0px';
      cursor.style.top = '0px';
      const currentScale = label ? 'scale(2.8)' : 'scale(1)';
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) ${currentScale}`;
      
      labelEl.style.left = '0px';
      labelEl.style.top = '0px';
      labelEl.style.transform = `translate3d(${cursorX}px, ${cursorY + 22}px, 0) translate(-50%, 0)`;

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('setCursor', onSetCursor);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [label]);

  // Disable on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div 
        ref={cursorRef} 
        className="custom-cursor" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: 'white',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          willChange: 'transform',
          transition: 'transform 0.15s ease-out, background-color 0.2s ease',
        }}
      />
      <div 
        ref={labelRef} 
        className="custom-cursor-label"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontSize: '10px',
          letterSpacing: '0.12em',
          fontWeight: 700,
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 9999,
          color: 'white',
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'opacity 0.2s ease',
        }}
      >
        {label}
      </div>
    </>
  );
};
