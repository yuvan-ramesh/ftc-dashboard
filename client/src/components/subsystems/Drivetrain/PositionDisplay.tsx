import React from 'react';
import { Vector3 } from '@/store/types/subsystems';

interface PositionDisplayProps {
  position: Vector3;
  heading: number;
}

const PositionDisplay: React.FC<PositionDisplayProps> = ({ position, heading }) => {
  // Convert heading from radians to degrees for display
  const headingDegrees = (heading * 180 / Math.PI) % 360;
  const normalizedHeading = headingDegrees < 0 ? headingDegrees + 360 : headingDegrees;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Position & Heading</h3>
      
      {/* Position values */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">X Position:</span>
          <span className="font-mono text-blue-400 text-lg">
            {position.x.toFixed(2)} in
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Y Position:</span>
          <span className="font-mono text-green-400 text-lg">
            {position.y.toFixed(2)} in
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Z Position:</span>
          <span className="font-mono text-purple-400 text-lg">
            {position.z.toFixed(2)} in
          </span>
        </div>
      </div>
      
      {/* Heading indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">Heading:</span>
          <span className="font-mono text-amber-400 text-lg">
            {normalizedHeading.toFixed(1)}°
          </span>
        </div>
        
        {/* Visual heading indicator */}
        <div className="relative w-full h-32 bg-gray-900 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Compass circle */}
            <div className="relative w-28 h-28 rounded-full border-2 border-gray-600">
              {/* Cardinal directions */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">N</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs text-gray-400">S</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 text-xs text-gray-400">W</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-xs text-gray-400">E</div>
              
              {/* Heading arrow */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `rotate(${normalizedHeading}deg)` }}
              >
                <div className="w-1 h-14 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-amber-400"></div>
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-11 bg-amber-400"></div>
                </div>
              </div>
              
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Heading arc */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="headingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d={`M 64,16 A 48,48 0 0,1 ${64 + 48 * Math.sin(heading)},${64 - 48 * Math.cos(heading)}`}
              fill="none"
              stroke="url(#headingGradient)"
              strokeWidth="8"
            />
          </svg>
        </div>
      </div>
      
      {/* Coordinate system reference */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Field Coordinate System (FTC standard)</p>
        <p>Origin: Field center | +X: Red alliance | +Y: Backstage</p>
      </div>
    </div>
  );
};

export default PositionDisplay;