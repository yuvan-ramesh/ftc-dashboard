import React from 'react';
import { Vector3 } from '@/store/types/subsystems';

interface VelocityAccelerationChartProps {
  velocity: Vector3;
  acceleration: Vector3;
}

const VelocityAccelerationChart: React.FC<VelocityAccelerationChartProps> = ({
  velocity,
  acceleration,
}) => {
  // Calculate magnitudes
  const velocityMagnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
  const accelerationMagnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
  
  // Calculate max values for scaling
  const maxVelocity = 60; // inches per second
  const maxAcceleration = 120; // inches per second squared
  
  const velocityPercent = (velocityMagnitude / maxVelocity) * 100;
  const accelerationPercent = (accelerationMagnitude / maxAcceleration) * 100;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Velocity & Acceleration</h3>
      
      {/* Velocity */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Velocity</span>
          <span className="font-mono text-blue-400">
            {velocityMagnitude.toFixed(1)} in/s
          </span>
        </div>
        
        {/* Velocity bar */}
        <div className="h-8 bg-gray-700 rounded-lg overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
            style={{ width: `${Math.min(velocityPercent, 100)}%` }}
          />
          {velocityPercent > 100 && (
            <div className="absolute inset-0 flex items-center justify-end pr-2">
              <span className="text-xs text-red-400 font-bold">OVER LIMIT</span>
            </div>
          )}
        </div>
        
        {/* Velocity components */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center">
            <div className="text-xs text-gray-500">X</div>
            <div className="font-mono text-sm text-gray-300">{velocity.x.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Y</div>
            <div className="font-mono text-sm text-gray-300">{velocity.y.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Z</div>
            <div className="font-mono text-sm text-gray-300">{velocity.z.toFixed(1)}</div>
          </div>
        </div>
      </div>
      
      {/* Acceleration */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Acceleration</span>
          <span className="font-mono text-green-400">
            {accelerationMagnitude.toFixed(1)} in/s²
          </span>
        </div>
        
        {/* Acceleration bar */}
        <div className="h-8 bg-gray-700 rounded-lg overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
            style={{ width: `${Math.min(accelerationPercent, 100)}%` }}
          />
          {accelerationPercent > 100 && (
            <div className="absolute inset-0 flex items-center justify-end pr-2">
              <span className="text-xs text-red-400 font-bold">OVER LIMIT</span>
            </div>
          )}
        </div>
        
        {/* Acceleration components */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center">
            <div className="text-xs text-gray-500">X</div>
            <div className="font-mono text-sm text-gray-300">{acceleration.x.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Y</div>
            <div className="font-mono text-sm text-gray-300">{acceleration.y.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Z</div>
            <div className="font-mono text-sm text-gray-300">{acceleration.z.toFixed(1)}</div>
          </div>
        </div>
      </div>
      
      {/* Visual vector display */}
      <div className="mt-4 bg-gray-900 rounded-lg p-3">
        <div className="text-xs text-gray-500 mb-2">Vector Visualization (Top View)</div>
        <svg viewBox="-60 -60 120 120" className="w-full h-32">
          {/* Grid */}
          <defs>
            <pattern id="vectorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect x="-60" y="-60" width="120" height="120" fill="url(#vectorGrid)" />
          
          {/* Axes */}
          <line x1="-60" y1="0" x2="60" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="0" y1="-60" x2="0" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="55" y="-5" fill="rgba(255,255,255,0.4)" fontSize="8">X</text>
          <text x="5" y="-55" fill="rgba(255,255,255,0.4)" fontSize="8">Y</text>
          
          {/* Velocity vector */}
          <line
            x1="0"
            y1="0"
            x2={velocity.x * 0.8}
            y2={-velocity.y * 0.8}
            stroke="#3B82F6"
            strokeWidth="2"
            markerEnd="url(#velocityArrow)"
          />
          
          {/* Acceleration vector */}
          <line
            x1="0"
            y1="0"
            x2={acceleration.x * 0.4}
            y2={-acceleration.y * 0.4}
            stroke="#10B981"
            strokeWidth="2"
            markerEnd="url(#accelerationArrow)"
          />
          
          {/* Arrow markers */}
          <defs>
            <marker id="velocityArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
            </marker>
            <marker id="accelerationArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#10B981" />
            </marker>
          </defs>
          
          {/* Center point */}
          <circle cx="0" cy="0" r="2" fill="white" />
        </svg>
        
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-gray-400">Velocity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span className="text-gray-400">Acceleration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocityAccelerationChart;