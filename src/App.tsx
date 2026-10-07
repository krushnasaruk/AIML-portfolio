import { useState, useCallback, useEffect } from 'react';
import { Frame } from './components/Frame';
import { VisualArchive } from './components/VisualArchive';
import { DetailView } from './components/DetailView';
import { Cursor } from './components/Cursor';
import { visualArchive, type ArchiveItem as ArchiveItemType } from './data/visualArchive';
import './styles/globals.css';
import './styles/typography.css';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedData, setSelectedData] = useState<{
    item: ArchiveItemType;
    originRect: DOMRect;
  } | null>(null);

  const handleItemSelect = useCallback((item: ArchiveItemType, rect: DOMRect) => {
    setSelectedData({ item, originRect: rect });
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedData(null);
  }, []);

  const handleNavigate = useCallback((newItem: ArchiveItemType) => {
    setSelectedData(prev => (prev ? { ...prev, item: newItem } : null));
    const idx = visualArchive.findIndex(it => it.id === newItem.id);
    if (idx >= 0) setActiveIndex(idx);
  }, []);

  const currentItem = selectedData?.item || visualArchive[activeIndex] || visualArchive[0];

  useEffect(() => {
    document.body.style.backgroundColor = currentItem.bgColor;
    document.body.style.transition = 'background-color 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
  }, [currentItem.bgColor]);

  return (
    <div 
      className="portfolio-app-root"
      style={{
        backgroundColor: currentItem.bgColor,
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        transition: 'background-color 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Cursor />
      
      {/* Fixed UI Frame overlay (only shown when not in full detail view to avoid dual headers) */}
      {!selectedData && (
        <Frame 
          activeIndex={activeIndex} 
          textColor={currentItem.textColor} 
        />
      )}
      
      {/* Main Horizontal Visual Archive */}
      <VisualArchive 
        onItemSelect={handleItemSelect}
        setActiveIndex={setActiveIndex}
        isVisible={!selectedData}
      />

      {/* Cinematic Aristide Detail View Overlay */}
      {selectedData && (
        <DetailView 
          item={selectedData.item} 
          originRect={selectedData.originRect}
          onClose={handleCloseDetail}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
