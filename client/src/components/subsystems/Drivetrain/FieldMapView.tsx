import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import EnhancedFieldOverlay from '@/components/views/FieldView/EnhancedFieldOverlay';

const TelemetryInfoPanel: React.FC = () => {
  const drivetrain = useSelector((state: RootState) => state.subsystems.drivetrain);
  const velocity = drivetrain.velocity;
  const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
  
  return (
    <div className="w-64 space-y-4">
      {/* Path Legend */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Path Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-sm text-gray-400">Planned Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-sm text-gray-400">Actual Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-yellow-500"></div>
            <span className="text-sm text-gray-400">Position History</span>
          </div>
        </div>
      </div>
      
      {/* Position Info */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Position</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">X:</span>
            <span className="text-white font-mono">{drivetrain.position.x.toFixed(1)}"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Y:</span>
            <span className="text-white font-mono">{drivetrain.position.y.toFixed(1)}"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">θ:</span>
            <span className="text-white font-mono">{(drivetrain.heading * 180 / Math.PI).toFixed(1)}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">COG:</span>
            <span className="text-white font-mono text-xs">
              ({drivetrain.centerOfGravity.x.toFixed(1)}, {drivetrain.centerOfGravity.y.toFixed(1)})
            </span>
          </div>
        </div>
      </div>
      
      {/* Velocity Info */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Velocity</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Speed:</span>
            <span className="text-white font-mono">{speed.toFixed(1)} in/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vx:</span>
            <span className="text-white font-mono">{velocity.x.toFixed(1)} in/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vy:</span>
            <span className="text-white font-mono">{velocity.y.toFixed(1)} in/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FieldMapView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate available space accounting for the side panel
        const availableWidth = rect.width - 300; // Account for padding and side panel (reduced from 280)
        const availableHeight = window.innerHeight - 250; // Leave less room for other UI elements (reduced from 400)
        
        // Use the smaller dimension to maintain square aspect ratio
        const size = Math.min(availableWidth, availableHeight, 1000); // Increased max from 700px to 1000px
        const finalSize = Math.max(500, size); // Increased minimum from 400px to 500px
        
        setCanvasSize({ width: finalSize, height: finalSize });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Draw the base field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill background
    ctx.fillStyle = '#111827'; // Dark gray background
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
  }, [canvasSize]);
  
  return (
    <div ref={containerRef} className="bg-gray-800 rounded-lg p-3">
      <h3 className="text-white text-lg font-medium mb-2">Field Map</h3>
      
      <div className="flex gap-3">
        {/* Field Container */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative" style={{ width: canvasSize.width, height: canvasSize.height }}>
            {/* Base field canvas */}
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="bg-gray-900 rounded"
              style={{ 
                width: `${canvasSize.width}px`, 
                height: `${canvasSize.height}px`
              }}
            />
        
            {/* Enhanced overlay canvas */}
            <canvas
              ref={overlayCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ 
                width: `${canvasSize.width}px`, 
                height: `${canvasSize.height}px`
              }}
            />
            
            {/* Enhanced field overlay component */}
            <EnhancedFieldOverlay
              canvasRef={overlayCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
            />
          </div>
        </div>
        
        {/* Telemetry Info Panel */}
        <TelemetryInfoPanel />
      </div>
    </div>
  );
};

export default FieldMapView;