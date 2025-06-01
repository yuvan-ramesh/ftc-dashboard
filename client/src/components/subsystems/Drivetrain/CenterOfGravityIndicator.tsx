import React from 'react';

interface CenterOfGravityIndicatorProps {
  centerOfGravity: {
    x: number;
    y: number;
  };
}

const CenterOfGravityIndicator: React.FC<CenterOfGravityIndicatorProps> = ({
  centerOfGravity,
}) => {
  // Robot dimensions (in inches) - adjust these based on your robot
  const robotWidth = 18;
  const robotLength = 18;
  
  // Convert COG to percentage for display
  const cogXPercent = ((centerOfGravity.x + robotWidth / 2) / robotWidth) * 100;
  const cogYPercent = ((centerOfGravity.y + robotLength / 2) / robotLength) * 100;
  
  // Determine if COG is within safe bounds (center 40% of robot)
  const isStable = 
    cogXPercent >= 30 && cogXPercent <= 70 &&
    cogYPercent >= 30 && cogYPercent <= 70;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Center of Gravity</h3>
      
      {/* Visual COG display */}
      <div className="relative bg-gray-900 rounded-lg p-4 mb-4">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0">
            {/* Robot outline */}
            <div className="absolute inset-4 border-2 border-gray-600 rounded-lg">
              {/* Safe zone */}
              <div className="absolute inset-[30%] border border-green-500 border-opacity-30 bg-green-500 bg-opacity-10 rounded"></div>
              
              {/* Grid lines */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700"></div>
              
              {/* COG indicator */}
              <div
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: `${cogXPercent}%`,
                  top: `${cogYPercent}%`,
                }}
              >
                <div className={`w-full h-full rounded-full ${isStable ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}>
                  <div className="absolute inset-0 rounded-full bg-current opacity-50 animate-ping"></div>
                </div>
              </div>
              
              {/* Robot front indicator */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="text-xs text-gray-500">FRONT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* COG coordinates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">X Offset</div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-lg text-white">
              {centerOfGravity.x > 0 ? '+' : ''}{centerOfGravity.x.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400">in</span>
          </div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Y Offset</div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-lg text-white">
              {centerOfGravity.y > 0 ? '+' : ''}{centerOfGravity.y.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400">in</span>
          </div>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className={`rounded-lg p-3 ${isStable ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isStable ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isStable ? 'text-green-400' : 'text-red-400'}`}>
            {isStable ? 'COG is stable' : 'COG outside safe zone'}
          </span>
        </div>
      </div>
      
      {/* Info text */}
      <div className="mt-3 text-xs text-gray-500">
        * Offsets from robot center. Green zone indicates stable region.
      </div>
    </div>
  );
};

export default CenterOfGravityIndicator;