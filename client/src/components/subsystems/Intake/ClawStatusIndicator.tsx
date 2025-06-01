import React from 'react';

interface ClawStatusIndicatorProps {
  hasSample: boolean;
  servoPosition: number;
}

const ClawStatusIndicator: React.FC<ClawStatusIndicatorProps> = ({
  hasSample,
  servoPosition,
}) => {
  // Determine claw state based on servo position
  const isOpen = servoPosition < 0.3;
  const isClosed = servoPosition > 0.7;
  const isMoving = !isOpen && !isClosed;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Claw Status</h3>
      
      {/* Visual claw representation */}
      <div className="relative bg-gray-900 rounded-lg p-6 mb-4">
        <div className="relative w-full flex justify-center items-center" style={{ height: '120px' }}>
          {/* Claw animation */}
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            {/* Left claw arm */}
            <path
              d={`M 30,50 Q 20,${50 - servoPosition * 20} 10,${50 - servoPosition * 30}`}
              stroke="#60A5FA"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            
            {/* Right claw arm */}
            <path
              d={`M 70,50 Q 80,${50 - servoPosition * 20} 90,${50 - servoPosition * 30}`}
              stroke="#60A5FA"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            
            {/* Center mount */}
            <circle cx="50" cy="50" r="8" fill="#374151" stroke="#60A5FA" strokeWidth="2" />
            
            {/* Sample indicator */}
            {hasSample && (
              <g className="animate-pulse">
                <circle cx="50" cy={35 - servoPosition * 10} r="12" fill="#F59E0B" opacity="0.8" />
                <text x="50" y={39 - servoPosition * 10} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
              </g>
            )}
          </svg>
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="space-y-3">
        {/* Sample status */}
        <div className={`rounded-lg p-3 ${hasSample ? 'bg-amber-900 bg-opacity-20' : 'bg-gray-700'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Sample Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${hasSample ? 'bg-amber-500 animate-pulse' : 'bg-gray-600'}`}></div>
              <span className={`text-sm font-medium ${hasSample ? 'text-amber-400' : 'text-gray-500'}`}>
                {hasSample ? 'Sample Detected' : 'No Sample'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Claw position */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Servo Position</span>
            <span className="font-mono text-blue-400">{(servoPosition * 100).toFixed(0)}%</span>
          </div>
          
          {/* Position bar */}
          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${servoPosition * 100}%` }}
            />
          </div>
          
          {/* Position labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Open</span>
            <span>Closed</span>
          </div>
        </div>
        
        {/* Claw state */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Claw State</span>
          <span className={`text-sm font-medium ${
            isOpen ? 'text-green-400' : 
            isClosed ? 'text-blue-400' : 
            'text-yellow-400'
          }`}>
            {isOpen ? 'Open' : isClosed ? 'Closed' : 'Moving'}
          </span>
        </div>
      </div>
      
      {/* Action hints */}
      {hasSample && !isClosed && (
        <div className="mt-3 p-2 bg-yellow-900 bg-opacity-20 rounded text-xs text-yellow-400">
          ⚠️ Sample detected but claw not fully closed
        </div>
      )}
    </div>
  );
};

export default ClawStatusIndicator;