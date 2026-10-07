import { visualArchive } from '../data/visualArchive';

interface FrameProps {
  activeIndex: number;
  textColor?: string;
}

export const Frame = ({ activeIndex, textColor = '#ffffff' }: FrameProps) => {
  const total = visualArchive.length;
  const beforeCount = activeIndex;
  const afterCount = Math.max(0, total - 1 - activeIndex);

  return (
    <div 
      className="fixed-frame"
      style={{
        color: textColor,
        transition: 'color 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
      }}
    >
      <div className="frame-top" style={{ pointerEvents: 'auto' }}>
        <div className="logo" style={{ color: textColor }}>AIML</div>

        {/* Aristide Benoist-style sliding indicator */}
        <div 
          className="progress-indicator"
          style={{ 
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {beforeCount > 0 && (
            <div className="progress-ticks" style={{ display: 'flex', gap: '3px', marginRight: '4px' }}>
              {Array.from({ length: beforeCount }).map((_, i) => (
                <div 
                  key={i} 
                  className="tick" 
                  style={{ width: '1.5px', height: '11px', backgroundColor: textColor, opacity: 0.25 }} 
                />
              ))}
            </div>
          )}

          <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
            {String(activeIndex + 1).padStart(2, '0')}
          </span>

          <div 
            style={{ 
              width: '18px', 
              height: '10px', 
              border: `1px solid ${textColor}`, 
              opacity: 0.75 
            }} 
          />

          <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
            {String(total).padStart(2, '0')}
          </span>

          {afterCount > 0 && (
            <div className="progress-ticks" style={{ display: 'flex', gap: '3px', marginLeft: '4px' }}>
              {Array.from({ length: afterCount }).map((_, i) => (
                <div 
                  key={i} 
                  className="tick" 
                  style={{ width: '1.5px', height: '11px', backgroundColor: textColor, opacity: 0.25 }} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="nav-link" style={{ borderColor: textColor, color: textColor }}>
          ABOUT
        </div>
      </div>

      <div className="frame-bottom" style={{ pointerEvents: 'auto' }}>
        <div className="footer-left" style={{ color: textColor, opacity: 0.85 }}>
          ARTIFICIAL INTELLIGENCE & MACHINE LEARNING CLUB / EST. 2024
        </div>
        <div className="social-links" style={{ color: textColor, opacity: 0.85 }}>
          <a href="#">EMAIL</a>
          <a href="#">GITHUB</a>
          <a href="#">INSTAGRAM</a>
        </div>
      </div>
    </div>
  );
};
