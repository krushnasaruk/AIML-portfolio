import { useEffect, useRef, useCallback } from 'react';
import { visualArchive, type ArchiveItem as ArchiveItemType } from '../data/visualArchive';
import { ArchiveItem } from './ArchiveItem';

interface VisualArchiveProps {
  onItemSelect: (item: ArchiveItemType, rect: DOMRect) => void;
  setActiveIndex: (index: number) => void;
  isVisible: boolean;
}

export const VisualArchive = ({ onItemSelect, setActiveIndex, isVisible }: VisualArchiveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  // Scroll dynamics
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const maxScroll = useRef(0);
  const itemStep = useRef(180); // card width + gap
  const lastActiveIndex = useRef(-1);

  // Pointer dragging dynamics
  const isPointerDown = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const scrollAtDragStart = useRef(0);
  const rafId = useRef<number | null>(null);

  // Measure card dimensions & boundaries
  const measureLayout = useCallback(() => {
    if (!trackRef.current) return;
    const firstItem = itemsRef.current[0];
    const secondItem = itemsRef.current[1];
    
    if (firstItem && secondItem) {
      const rect1 = firstItem.getBoundingClientRect();
      const rect2 = secondItem.getBoundingClientRect();
      itemStep.current = Math.abs(rect2.left - rect1.left) || 180;
    } else if (firstItem) {
      itemStep.current = firstItem.offsetWidth + 28;
    }

    const totalItems = visualArchive.length;
    maxScroll.current = Math.max(0, (totalItems - 1) * itemStep.current);
    // Clamp target within bounds
    targetScroll.current = Math.max(0, Math.min(maxScroll.current, targetScroll.current));
  }, []);

  // Mathematical 3D card layout update
  const applyTransforms = useCallback(() => {
    const step = itemStep.current || 180;
    const curr = currentScroll.current;
    const maxDist = window.innerWidth * 0.45;
    const total = visualArchive.length;

    // Determine current center-most index
    const closestIdx = Math.max(0, Math.min(total - 1, Math.round(curr / step)));
    if (closestIdx !== lastActiveIndex.current) {
      lastActiveIndex.current = closestIdx;
      setActiveIndex(closestIdx);
    }

    // Apply 3D perspective transforms to each item
    itemsRef.current.forEach((el, index) => {
      if (!el) return;
      const xOffset = index * step - curr;
      const absOffset = Math.abs(xOffset);

      if (absOffset > maxDist * 1.6) {
        // Outside viewport influence
        el.style.transform = `perspective(1200px) translateZ(0px) rotateY(0deg) scale(0.86)`;
        el.style.zIndex = '1';
        el.style.opacity = '0.5';
        return;
      }

      const ratio = Math.max(0, 1 - absOffset / maxDist);
      const scale = 0.88 + ratio * 0.22;
      const rotateY = (xOffset / maxDist) * -18;
      const z = ratio * 65;
      const zIndex = Math.round(ratio * 50) + 1;
      const opacity = 0.6 + ratio * 0.4;

      el.style.transform = `perspective(1200px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
      el.style.zIndex = `${zIndex}`;
      el.style.opacity = `${opacity}`;
    });
  }, [setActiveIndex]);

  // Main animation RAF loop
  useEffect(() => {
    const loop = () => {
      const diff = targetScroll.current - currentScroll.current;
      if (Math.abs(diff) > 0.05) {
        currentScroll.current += diff * 0.12; // Silky smooth lerp
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${currentScroll.current}px, 0, 0)`;
        }
        applyTransforms();
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [applyTransforms]);

  // Initial layout measurement and resize listener
  useEffect(() => {
    measureLayout();
    const timer = setTimeout(measureLayout, 100);
    window.addEventListener('resize', measureLayout);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureLayout);
    };
  }, [measureLayout]);

  // Wheel listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isVisible) return;
      e.preventDefault();

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const scrollSpeed = Math.abs(delta) > 50 ? 1.4 : 1.1;

      targetScroll.current = Math.max(
        0,
        Math.min(maxScroll.current, targetScroll.current + delta * scrollSpeed)
      );
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isVisible]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      const step = itemStep.current || 180;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetScroll.current = Math.min(maxScroll.current, targetScroll.current + step);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetScroll.current = Math.max(0, targetScroll.current - step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetScroll.current = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetScroll.current = maxScroll.current;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // Drag / Swipe support
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isVisible) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isPointerDown.current = true;
    isDragging.current = false;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    scrollAtDragStart.current = targetScroll.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current || !isVisible) return;

    const dx = dragStartX.current - e.clientX;
    const dy = dragStartY.current - e.clientY;

    if (!isDragging.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        isDragging.current = true;
      }
    }

    if (isDragging.current) {
      targetScroll.current = Math.max(
        0,
        Math.min(maxScroll.current, scrollAtDragStart.current + dx * 1.3)
      );
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    isDragging.current = false;
  };

  return (
    <div 
      ref={containerRef} 
      className="visual-archive-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        opacity: 1,
        pointerEvents: isVisible ? 'auto' : 'none',
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      <div 
        ref={trackRef}
        className="gallery-strip"
        style={{
          display: 'flex',
          gap: 'clamp(20px, 2.2vw, 36px)',
          height: '100%',
          alignItems: 'center',
          paddingLeft: 'calc(50vw - 85px)',
          paddingRight: 'calc(50vw - 85px)',
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {visualArchive.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            style={{
              flexShrink: 0,
              willChange: 'transform, opacity',
              transformOrigin: 'center center',
            }}
          >
            <ArchiveItem 
              data={item} 
              index={index} 
              onSelect={onItemSelect} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};
