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
        // Calculate available space
        const availableWidth = rect.width - 64; // Account for padding
        const availableHeight = window.innerHeight - 400; // Leave room for other UI elements
        
        // Use the smaller dimension to maintain square aspect ratio
        const size = Math.min(availableWidth, availableHeight, 800); // Max 800px
        const finalSize = Math.max(500, size); // Minimum 500px
        
        setCanvasSize({ width: finalSize, height: finalSize });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return (
    <div ref={containerRef} className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Field Map</h3>
      
      <div className="relative flex justify-center" style={{ minHeight: '600px' }}>
        <div className="relative" style={{ width: canvasSize.width, height: canvasSize.height }}>
          {/* Base field canvas */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="bg-gray-900 rounded"
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
          <div className="absolute bottom-2 left-2 bg-gray-900 rounded p-3 text-sm" style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}>
            <div className="text-white font-semibold mb-2">Path Legend</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-blue-500 rounded-full"></div>
                <span className="text-gray-200">Planned Path</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-green-500 rounded-full"></div>
                <span className="text-gray-200">Actual Path</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldMapView;