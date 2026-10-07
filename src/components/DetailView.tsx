import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { visualArchive, type ArchiveItem as ArchiveItemType } from '../data/visualArchive';

interface DetailViewProps {
  item: ArchiveItemType;
  originRect?: DOMRect | null;
  onClose: () => void;
  onNavigate?: (item: ArchiveItemType) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ 
  item, 
  originRect, 
  onClose,
  onNavigate 
}) => {
  const [expandedInfo, setExpandedInfo] = useState(false);
  const isClosingRef = useRef(false);
  const mountTime = useRef(Date.now());
  const wheelDeltaAcc = useRef(0);

  // DOM element refs for 100% reliable GSAP animation
  const heroRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const prevImgRef = useRef<HTMLDivElement>(null);
  const nextImgRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Find index and adjacent items in visualArchive
  const currentIndex = visualArchive.findIndex(it => it.id === item.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const prevItem = visualArchive[(safeIndex - 1 + visualArchive.length) % visualArchive.length];
  const nextItem = visualArchive[(safeIndex + 1) % visualArchive.length];

  const total = visualArchive.length;
  const beforeCount = safeIndex;
  const afterCount = Math.max(0, total - 1 - safeIndex);

  // Aristide Benoist-style typography splitting
  const words = item.title.trim().split(/\s+/);
  let line1 = '';
  let line2 = '';

  if (words.length >= 2) {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');
  } else if (item.title.length > 5) {
    const mid = Math.ceil(item.title.length / 2);
    line1 = item.title.slice(0, mid);
    line2 = item.title.slice(mid);
  } else {
    line1 = item.title;
    line2 = '';
  }

  // Calculate destination hero dimensions in viewport
  const getHeroRect = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const targetWidth = Math.min(760, Math.max(340, w * 0.48));
    const targetHeight = Math.min(490, Math.max(240, h * 0.47));
    const left = Math.round((w - targetWidth) / 2);
    const top = Math.round(h * 0.47 - targetHeight / 2);
    return { left, top, width: targetWidth, height: targetHeight };
  };

  // Find the exact gallery thumbnail position to dock into on exit
  const getExitRect = useCallback(() => {
    const cardEl = document.querySelector(`.archive-item[data-id="${item.id}"]`);
    if (cardEl) {
      const r = cardEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return { left: r.left, top: r.top, width: r.width, height: r.height };
      }
    }
    if (originRect) {
      return { left: originRect.left, top: originRect.top, width: originRect.width, height: originRect.height };
    }
    const hero = getHeroRect();
    return { left: hero.left, top: hero.top, width: 160, height: 360 };
  }, [item.id, originRect]);

  // Guaranteed GSAP Reverse Exit Animation (1.15s duration)
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const exitRect = getExitRect();

    // 1. Hero image glides and shrinks from center hero position back to gallery card
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        left: exitRect.left,
        top: exitRect.top,
        width: exitRect.width,
        height: exitRect.height,
        borderRadius: 8,
        duration: 1.15,
        ease: 'power3.inOut',
        onComplete: () => {
          onClose();
        },
      });
    } else {
      onClose();
    }

    // 2. Backdrop smoothly fades out over 1.15s, revealing the gallery underneath
    if (backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 1.15,
        ease: 'power3.inOut',
      });
    }

    // 3. Giant typography smoothly fades out and gently scales
    if (typographyRef.current) {
      gsap.to(typographyRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 0.85,
        ease: 'power3.inOut',
      });
    }

    // 4. Flanking adjacent images smoothly fade out
    if (prevImgRef.current && nextImgRef.current) {
      gsap.to([prevImgRef.current, nextImgRef.current], {
        opacity: 0,
        scale: 0.95,
        duration: 0.85,
        ease: 'power3.inOut',
      });
    }

    // 5. Header and Explore footer elements smoothly fade out
    if (headerRef.current && exploreRef.current && footerRef.current) {
      gsap.to([headerRef.current, exploreRef.current, footerRef.current], {
        opacity: 0,
        duration: 0.7,
        ease: 'power3.inOut',
      });
    }
  }, [getExitRect, onClose]);

  const goToNext = useCallback(() => {
    if (onNavigate) {
      onNavigate(nextItem);
    }
  }, [nextItem, onNavigate]);

  const goToPrev = useCallback(() => {
    if (onNavigate) {
      onNavigate(prevItem);
    }
  }, [prevItem, onNavigate]);

  // GSAP Entrance Animation on mount
  useEffect(() => {
    const hero = getHeroRect();
    const startRect = originRect || {
      left: hero.left,
      top: hero.top,
      width: 160,
      height: 360,
    };

    // Initial state: hero at originRect, all overlay elements hidden
    if (heroRef.current) {
      gsap.set(heroRef.current, {
        position: 'fixed',
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        borderRadius: 8,
        zIndex: 20,
        opacity: 1,
      });

      // Animate hero to centered large size over 1.15s
      gsap.to(heroRef.current, {
        left: hero.left,
        top: hero.top,
        width: hero.width,
        height: hero.height,
        borderRadius: 2,
        duration: 1.15,
        ease: 'power3.out',
      });
    }

    if (backdropRef.current) {
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.to(backdropRef.current, { opacity: 1, duration: 1.15, ease: 'power3.out' });
    }

    if (typographyRef.current) {
      gsap.set(typographyRef.current, { opacity: 0, scale: 0.94 });
      gsap.to(typographyRef.current, { opacity: 1, scale: 1, duration: 1.15, ease: 'power3.out', delay: 0.05 });
    }

    if (prevImgRef.current && nextImgRef.current) {
      gsap.set([prevImgRef.current, nextImgRef.current], { opacity: 0, scale: 0.95 });
      gsap.to([prevImgRef.current, nextImgRef.current], { opacity: 0.85, scale: 1, duration: 1.15, ease: 'power3.out', delay: 0.05 });
    }

    if (headerRef.current && exploreRef.current && footerRef.current) {
      gsap.set([headerRef.current, exploreRef.current, footerRef.current], { opacity: 0 });
      gsap.to([headerRef.current, exploreRef.current, footerRef.current], { opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.1 });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, goToNext, goToPrev, originRect]);

  // Inertia-safe wheel: returns to main page when scrolled
  const handleWheel = (e: React.WheelEvent) => {
    if (Date.now() - mountTime.current < 600) return;
    wheelDeltaAcc.current += Math.abs(e.deltaY) + Math.abs(e.deltaX);
    if (wheelDeltaAcc.current > 100) {
      wheelDeltaAcc.current = 0;
      handleClose();
    }
  };

  const hero = getHeroRect();
  const sideGap = Math.min(42, Math.max(20, window.innerWidth * 0.025));
  const sideWidth = Math.min(680, Math.max(280, window.innerWidth * 0.42));

  return (
    <div 
      className="aristide-detail-stage"
      onWheel={handleWheel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      {/* 1. BACKDROP OVERLAY: Fades in on open, fades out on exit to reveal gallery underneath */}
      <div 
        ref={backdropRef}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: item.bgColor,
          zIndex: 2,
          cursor: 'pointer',
        }}
      />

      {/* 2. TOP FRAME HEADER (Matching Screenshots 1, 2, 3) */}
      <div 
        ref={headerRef}
        style={{
          position: 'fixed',
          top: '32px',
          left: '40px',
          right: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 30,
          pointerEvents: 'auto',
          color: item.textColor,
        }}
      >
        <div 
          onClick={handleClose}
          style={{
            fontFamily: "'Big Shoulders Display', 'Oswald', sans-serif",
            fontSize: '2.1rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            cursor: 'pointer',
          }}
        >
          AIML
        </div>

        {/* Aristide sliding progress ticks */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontFamily: "'Space Mono', monospace",
            color: item.textColor,
          }}
        >
          {beforeCount > 0 && (
            <div style={{ display: 'flex', gap: '3px', marginRight: '4px' }}>
              {Array.from({ length: beforeCount }).map((_, i) => (
                <div 
                  key={i} 
                  style={{ width: '1.5px', height: '11px', backgroundColor: item.textColor, opacity: 0.25 }} 
                />
              ))}
            </div>
          )}

          <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>
            {String(safeIndex + 1).padStart(2, '0')}
          </span>

          <div 
            style={{ 
              width: '18px', 
              height: '10px', 
              border: `1px solid ${item.textColor}`, 
              opacity: 0.8 
            }} 
          />

          <span style={{ opacity: 0.6, fontSize: '0.82rem' }}>
            {String(total).padStart(2, '0')}
          </span>

          {afterCount > 0 && (
            <div style={{ display: 'flex', gap: '3px', marginLeft: '4px' }}>
              {Array.from({ length: afterCount }).map((_, i) => (
                <div 
                  key={i} 
                  style={{ width: '1.5px', height: '11px', backgroundColor: item.textColor, opacity: 0.25 }} 
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div 
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              fontWeight: 600,
              borderBottom: `1px solid ${item.textColor}`,
              paddingBottom: '2px',
              cursor: 'pointer',
            }}
          >
            ABOUT
          </div>

          <div 
            onClick={handleClose}
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              fontWeight: 700,
              borderBottom: `1px solid ${item.textColor}`,
              paddingBottom: '2px',
              cursor: 'pointer',
              opacity: 0.85,
            }}
          >
            CLOSE ✕
          </div>
        </div>
      </div>

      {/* 3. FLANKING PREVIOUS IMAGE (Peeking on left edge, exactly like Screenshots 1, 2, 3) */}
      <div 
        ref={prevImgRef}
        onClick={goToPrev}
        title={`Previous: ${prevItem.title}`}
        style={{
          position: 'fixed',
          left: `${hero.left - sideGap - sideWidth}px`,
          top: `${hero.top}px`,
          width: `${sideWidth}px`,
          height: `${hero.height}px`,
          borderRadius: '2px',
          overflow: 'hidden',
          cursor: 'pointer',
          zIndex: 6,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          window.dispatchEvent(new CustomEvent('setCursor', { detail: 'PREV' }));
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.85';
          window.dispatchEvent(new CustomEvent('setCursor', { detail: '' }));
        }}
      >
        <img 
          src={prevItem.image} 
          alt={prevItem.title}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'grayscale(15%) brightness(0.92)',
          }}
        />
      </div>

      {/* 4. ACTIVE HERO IMAGE: Driven by GSAP for 100% Guaranteed Forward and Reverse Transition */}
      <div 
        ref={heroRef}
        onClick={handleClose}
        style={{
          position: 'fixed',
          overflow: 'hidden',
          zIndex: 20,
          background: '#151515',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          cursor: 'pointer',
        }}
      >
        <img 
          src={item.image} 
          alt={item.title}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* 5. FLANKING NEXT IMAGE (Peeking on right edge, exactly like Screenshots 1, 2, 3) */}
      <div 
        ref={nextImgRef}
        onClick={goToNext}
        title={`Next: ${nextItem.title}`}
        style={{
          position: 'fixed',
          left: `${hero.left + hero.width + sideGap}px`,
          top: `${hero.top}px`,
          width: `${sideWidth}px`,
          height: `${hero.height}px`,
          borderRadius: '2px',
          overflow: 'hidden',
          cursor: 'pointer',
          zIndex: 6,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          window.dispatchEvent(new CustomEvent('setCursor', { detail: 'NEXT' }));
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.85';
          window.dispatchEvent(new CustomEvent('setCursor', { detail: '' }));
        }}
      >
        <img 
          src={nextItem.image} 
          alt={nextItem.title}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'grayscale(15%) brightness(0.92)',
          }}
        />
      </div>

      {/* 6. GIANT ARCHITECTURAL TYPOGRAPHY (OVERLAPPING IN FRONT OF THE IMAGES) */}
      <div 
        ref={typographyRef}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 25,
        }}
      >
        <div 
          style={{
            fontFamily: "'Big Shoulders Display', 'Anton', sans-serif",
            fontWeight: 900,
            fontSize: line2 ? 'clamp(5.5rem, 15vw, 14.5rem)' : 'clamp(6.5rem, 17vw, 16.5rem)',
            color: item.textColor,
            letterSpacing: '0.06em',
            lineHeight: 0.82,
            textTransform: 'uppercase',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            width: '94vw',
          }}
        >
          {line1.split('').map((char, i) => (
            <span key={i} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </div>

        {line2 && (
          <div 
            style={{
              fontFamily: "'Big Shoulders Display', 'Anton', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(5.5rem, 15vw, 14.5rem)',
              color: item.textColor,
              letterSpacing: '0.06em',
              lineHeight: 0.82,
              textTransform: 'uppercase',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              width: '94vw',
              marginTop: '1.2vh',
            }}
          >
            {line2.split('').map((char, i) => (
              <span key={i} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </div>
        )}
      </div>

      {/* 7. ARISTIDE-STYLE BOTTOM "EXPLORE" SECTION (Centered directly below the hero image) */}
      <div 
        ref={exploreRef}
        style={{
          position: 'fixed',
          bottom: '6.5vh',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: item.textColor,
          zIndex: 30,
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        onClick={() => setExpandedInfo(!expandedInfo)}
      >
        <div 
          style={{
            fontSize: '0.78rem',
            letterSpacing: '0.22em',
            fontWeight: 700,
            textTransform: 'uppercase',
            borderBottom: `1px solid ${item.textColor}`,
            paddingBottom: '2px',
          }}
        >
          EXPLORE
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: item.textColor, opacity: 0.6 }} />

        <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1 }}>+</div>

        {expandedInfo && (
          <div 
            style={{
              marginTop: '8px',
              maxWidth: '500px',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              opacity: 0.9,
              textAlign: 'center',
              backgroundColor: 'rgba(0,0,0,0.06)',
              padding: '12px 18px',
              borderRadius: '6px',
            }}
          >
            <div style={{ fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}>
              {item.category} // {item.year}
            </div>
            {item.description}
          </div>
        )}
      </div>

      {/* 8. BOTTOM FRAME (Left subtitle & Right social links) */}
      <div 
        ref={footerRef}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '40px',
          right: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 30,
          pointerEvents: 'none',
          color: item.textColor,
          fontSize: '0.7rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight: 1.4,
        }}
      >
        <div style={{ maxWidth: '240px', opacity: 0.85 }}>
          ARTIFICIAL INTELLIGENCE & MACHINE LEARNING CLUB / EST. 2024
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', pointerEvents: 'auto' }}>
          <a href="#" style={{ color: item.textColor, opacity: 0.85 }}>EMAIL</a>
          <a href="#" style={{ color: item.textColor, opacity: 0.85 }}>INSTAGRAM</a>
          <a href="#" style={{ color: item.textColor, opacity: 0.85 }}>GITHUB</a>
        </div>
      </div>
    </div>
  );
};
