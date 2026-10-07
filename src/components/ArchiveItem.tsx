import React, { useRef } from 'react';
import type { ArchiveItem as ArchiveItemType } from '../data/visualArchive';

interface ArchiveItemProps {
  data: ArchiveItemType;
  index: number;
  onSelect: (item: ArchiveItemType, rect: DOMRect) => void;
}

export const ArchiveItem: React.FC<ArchiveItemProps> = ({ data, onSelect }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const triggerSelect = () => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    onSelect(data, rect);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    pointerStart.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    const dt = Date.now() - pointerStart.current.time;
    pointerStart.current = null;

    // Movement under 8px and within 500ms is a clean click
    if (dx < 8 && dy < 8 && dt < 500) {
      triggerSelect();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSelect();
  };

  const handleMouseEnter = () => {
    window.dispatchEvent(new CustomEvent('setCursor', { detail: 'EXPLORE' }));
  };

  const handleMouseLeave = () => {
    window.dispatchEvent(new CustomEvent('setCursor', { detail: '' }));
  };

  return (
    <div 
      ref={itemRef}
      className="archive-item"
      data-id={data.id}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        flexShrink: 0,
        width: 'clamp(125px, 9.5vw, 170px)',
        height: 'clamp(280px, 46vh, 390px)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        background: '#1a1a1a',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.18)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <img 
        src={data.image} 
        alt={data.title}
        draggable={false}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle bottom gradient for label contrast */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card Info Label */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '12px',
          right: '12px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <span 
          className={`typo-${data.typographyStyle}`}
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: '#ffffff',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.title}
        </span>
        <span 
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.75)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {data.category}
        </span>
      </div>
    </div>
  );
};
