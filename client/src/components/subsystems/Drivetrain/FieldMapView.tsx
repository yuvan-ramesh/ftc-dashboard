import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import EnhancedFieldOverlay from '@/components/views/FieldView/EnhancedFieldOverlay';

const FieldMapView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Use most of available width but maintain square aspect ratio
        const maxSize = Math.min(rect.width - 32, window.innerHeight * 0.6); // Limit to 60% of viewport height
        const size = Math.max(600, maxSize); // Minimum 600px
        setCanvasSize({ width: size, height: size });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return (
    <div ref={containerRef} className="bg-gray-800 rounded-lg p-4 h-full">
      <h3 className="text-white text-lg font-medium mb-4">Field Map</h3>
      
      <div className="relative" style={{ height: canvasSize.height }}>
        {/* Base field canvas */}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute top-0 left-0 bg-gray-900 rounded"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Enhanced overlay canvas */}
        <canvas
          ref={overlayCanvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Enhanced field overlay component */}
        <EnhancedFieldOverlay
          canvasRef={overlayCanvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
        />
        
        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-90 rounded p-2 text-xs">
          <div className="text-white font-medium mb-1">Path Legend</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-0.5 bg-blue-500" style={{ borderStyle: 'dashed', borderWidth: '1px 0', borderColor: 'rgb(59 130 246)' }}></div>
            <span className="text-gray-300">Planned Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-gray-300">Actual Path</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldMapView;